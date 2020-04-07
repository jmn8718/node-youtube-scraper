const puppeteer = require('puppeteer');
const uniq = require('lodash.uniq');
const difference = require('lodash.difference');
const { map } = require('bluebird');
const { filterNewVideos } = require('../controllers/videos');
const { getVideosData } = require('../controllers/youtube');
const { publishVideo } = require('../controllers/api');
const { saveExecution } = require('../controllers/executions');
const { saveToDisc } = require('../backup');
const {
  defaultLimit,
  logsFolder,
  executionID,
  puppeteerConfig
} = require('../config');
const { timeout } = require('./utils');

const getVideoIds = async function (page) {
  const videoIds = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href*="/watch"]'));
    return links.map((link) => link.href.substr(link.href.indexOf('v=') + 2));
  });
  return uniq(videoIds);
};

const loadMoreVideos = async function (page, waitFor = 2) {
  console.log('load more videos');
  await page.evaluate(() => {
    const element = document.getElementById('continuations');
    element.scrollIntoView();
  });
  await timeout(waitFor);
};

const crawl = async function (channelId, options = {}) {
  const {
    limit = defaultLimit,
    retry = true,
    execution = executionID
  } = options;
  const browser = await puppeteer.launch(puppeteerConfig);
  let videoIds = [];
  let error = false;
  let errorMessage = '';
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });
  try {
    console.log('opened browser');
    await page.goto(`https://www.youtube.com/channel/${channelId}/videos`, {
      waitUntil: 'networkidle2'
    });
    console.log(`Visited https://www.youtube.com/channel/${channelId}/videos`);
    await page.waitFor('#contents', { timeout: 10000 });

    let search = true;
    while (search) {
      const links = await getVideoIds(page);
      console.log(
        `${channelId} => Retrieved: ${links.length} - Current videos: ${videoIds.length} - limit: ${limit}`
      );
      if (links.length !== videoIds.length) {
        const newVideos = await filterNewVideos(
          channelId,
          difference(links, videoIds)
        );
        videoIds.push(...newVideos);
        console.log(
          `${channelId} ==> nonExistingVideos: ${newVideos.length} || links: ${links.length}`
        );
        if (videoIds.length !== links.length) {
          search = false;
        }
      } else {
        search = false;
      }
      if (videoIds.length > limit) {
        search = false;
      }
      if (search) {
        await loadMoreVideos(page, 5);
      }
    }
  } catch (err) {
    console.error(err);
    await page.screenshot({
      path: `${logsFolder}/${execution}_${channelId}.png`,
      fullPage: true
    });
    if (retry) {
      console.log('closing browser');
      await browser.close();
      return crawl(channelId, { limit, retry: false, execution });
    }
    error = true;
    errorMessage = err.message;
  }
  console.log('closing browser');
  await browser.close();
  return { videoIds, error, errorMessage, retry };
};

const crawlChannels = async function (channels = [], options = {}) {
  const { concurrency = 2, execution = executionID } = options;
  const results = await map(
    channels,
    async ({ _id, channelId }) => {
      const videos = [];
      let executionError = '';
      try {
        const { videoIds, error, errorMessage } = await crawl(channelId, {
          execution
        });
        if (error) {
          executionError = errorMessage;
          console.log(`error for channel ${channelId} => ${errorMessage}`);
        } else {
          saveToDisc(channelId, videoIds, { execution });
          videos.push(...videoIds);
        }
        const youtubeVideosData = await getVideosData(videoIds);
        await map(youtubeVideosData, publishVideo, {
          concurrency: 4
        });
      } catch (err) {
        console.error(err);
      }
      return { _id, channelId, videos, error: executionError };
    },
    { concurrency }
  );
  await saveExecution(execution, results);
  return results;
};

module.exports = {
  crawl,
  crawlChannels
};
