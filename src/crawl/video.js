const puppeteer = require("puppeteer");
const { map } = require("bluebird");
const filter = require("lodash.filter");
const { logsFolder, executionID, puppeteerConfig } = require("../config");
const { saveToDisc } = require("../backup");

const isVideoLoaded = function(page) {
  // Check video title if video has been loaded
  return page.evaluate(() => {
    const titles = Array.from(
      document.querySelectorAll("h1.title.ytd-video-primary-info-renderer")
    );
    return titles.length > 0 && titles[0].innerText.trim() !== "";
  });
};

const crawl = async function(videoId) {
  const browser = await puppeteer.launch(puppeteerConfig);
  let loaded = [];
  let error = false;
  let errorMessage = "";
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });
  try {
    console.log("opened browser");
    await page.goto(`https://www.youtube.com/watch?v=${videoId}`, {
      waitUntil: "networkidle2"
    });
    console.log(`https://www.youtube.com/watch?v=${videoId}`);
    await page.waitFor("#container.ytd-video-primary-info-renderer", {
      timeout: 20000
    }); 
    // .yt-playability-error-supported-renderers 
    // .WARNING

    loaded = await isVideoLoaded(page);
    console.log(`${videoId}=> ${loaded ? "l" : "n"}`);
    if (!loaded) {
      await page.screenshot({
        path: `${logsFolder}/notloaded_${executionID}_${videoId}.png`,
        fullPage: true
      });
    }
  } catch (err) {
    console.error(err);
    await page.screenshot({
      path: `${logsFolder}/video_${executionID}_${videoId}.png`,
      fullPage: true
    });
    error = true;
    errorMessage = err.message;
  }
  console.log("closing browser");
  await browser.close();
  return { loaded, error, errorMessage };
};

const crawlVideos = async function(videos = [], concurrency = 2) {
  const results = await map(
    videos,
    async ({ _id, channelId, youtubeId }) => {
      let videoIsActive = false;
      try {
        const { loaded, error, errorMessage } = await crawl(youtubeId);
        if (error) {
          console.log(`error for video ${youtubeId} => ${errorMessage}`);
        }
        videoIsActive = loaded;
      } catch (err) {
        console.error(err);
      }
      return { _id, channelId, youtubeId, videoIsActive };
    },
    { concurrency }
  );
  saveToDisc(
    executionID,
    filter(results, { videoIsActive: false }).map(
      ({ _id, channelId, youtubeId }) => `${_id} ${youtubeId} ${channelId}`
    )
  );
};

module.exports = {
  crawl,
  crawlVideos
};
