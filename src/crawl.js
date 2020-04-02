const puppeteer = require("puppeteer");
const uniq = require("lodash.uniq");

const timeout = seconds => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), seconds * 1000);
  });
};
const getVideoIds = async function(page) {
  const videoIds = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href*="/watch"]'));
    return links.map(link => link.href.substr(link.href.indexOf("v=") + 2));
  });
  return uniq(videoIds);
};

const loadMoreVideos = async function(page, waitFor = 2) {
  console.log("load");
  await page.evaluate(() => {
    const element = document.getElementById("continuations");
    element.scrollIntoView();
  });
  await timeout(waitFor);
};

const crawl = async function(channelId, limit = 100) {
  const browser = await puppeteer.launch();
  let videoIds = [];
  try {
    const page = await browser.newPage();
    page.setViewport({ width: 1280, height: 926 });
    console.log("opened browser");
    await page.goto(`https://www.youtube.com/channel/${channelId}/videos`, {
      waitUntil: "networkidle2"
    });
    console.log(`Visited https://www.youtube.com/channel/${channelId}/videos`);
    await page.waitFor("#contents", { timeout: 10000 });

    let search = true;
    while (search) {
      const links = await getVideoIds(page);
      console.log(
        `Retrieved: ${links.length} - Current videos: ${videoIds.length} - limit: ${limit}`
      );
      if (links.length !== videoIds.length) {
        videoIds = [...links];
      } else {
        console.log("y");
        search = false;
      }
      if (videoIds.length > limit) {
        console.log("x");
        search = false;
      }
      if (search) {
        await loadMoreVideos(page, 5)
      }
    }
  } catch (err) {
    console.log(err);
  }
  console.log("closing browser");
  await browser.close();
  return videoIds;
};

module.exports = {
  crawl
};
