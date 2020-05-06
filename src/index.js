const { argv } = require('yargs');
const get = require('lodash.get');

const { connect, close } = require('./db');
const { crawlChannels } = require('./crawl/channelVideos');
const { crawlVideos } = require('./crawl/video');
const { getChannelIds } = require('./controllers/users');
const { getVideoIds } = require('./controllers/videos');

const init = async function (options = {}) {
  try {
    await connect();

    // crawl channel to get videos
    const channelIds = await getChannelIds({
      limit: 0,
      youtubeIds: get(options, 'youtubeIds')
    });
    await crawlChannels(channelIds);

    // crawl videos to check status
    // const videoIds = await getVideoIds({});
    // await crawlVideos(videoIds);

    await close();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

init(argv);
