const { map } = require('bluebird');
const get = require('lodash.get');
const filter = require('lodash.filter');
const { getDB } = require('../db');

const checkVideoExists = async function (channelId, videoId) {
  const db = await getDB();

  const count = await db.collection('videos').countDocuments({
    'youtube.channelId': channelId,
    'youtube.youtubeId': videoId
  });
  return count > 0;
};

const filterNewVideos = async function (channelId, videoIds = []) {
  const results = await map(videoIds, async (videoId) => {
    const exists = await checkVideoExists(channelId, videoId);
    return {
      exists,
      videoId
    };
  });
  return filter(results, { exists: false }).map(({ videoId }) => videoId);
};

const getVideoIds = async function (options) {
  const db = await getDB();

  const query = {
    youtube: { $exists: true }
  };
  const channelId = get(options, 'channelId');

  if (channelId) {
    query['youtube.channelId'] = channelId;
  }

  const videos = await db
    .collection('videos')
    .find(query, {
      projection: {
        'youtube.youtubeId': 1,
        'youtube.channelId': 1
      },
      limit: get(options, 'limit', 0),
      skip: get(options, 'skip', 0)
    })
    .toArray();

  return videos.map((video) => ({
    _id: video._id,
    channelId: get(video, 'youtube.channelId', ''),
    youtubeId: get(video, 'youtube.youtubeId', '')
  }));
};

module.exports = {
  checkVideoExists,
  filterNewVideos,
  getVideoIds
};
