const { map } = require("bluebird");
const filter = require("lodash.filter");
const { getDB } = require("../db");

const checkVideoExists = async function(channelId, videoId) {
  const db = await getDB();

  const count = await db.collection("videos").countDocuments({
    "youtube.channelId": channelId,
    "youtube.youtubeId": videoId
  });
  return count > 0;
};

const filterNewVideos = async function(channelId, videoIds = []) {
  const results = await map(videoIds, async videoId => {
    const exists = await checkVideoExists(channelId, videoId);
    return {
      exists,
      videoId
    };
  });
  return filter(results, { exists: false }).map(({ videoId }) => videoId);
};

module.exports = {
  checkVideoExists,
  filterNewVideos
};
