const get = require('lodash.get');
const { getDB } = require('../db');

const getChannelIds = async function (options = {}) {
  const db = await getDB();
  const query = {
    'youtube.channelId': { $exists: true }
  };

  if (options.youtubeIds) {
    query['youtube.channelId'] = {
      $in:
        typeof options.youtubeIds === 'string'
          ? options.youtubeIds.split(',')
          : options.youtubeIds
    };
  }
  const users = await db
    .collection('users')
    .find(query, {
      projection: {
        'youtube.channelId': 1
      },
      limit: get(options, 'limit', 0),
      skip: get(options, 'skip', 0)
    })
    .toArray();

  return users.map((user) => ({
    _id: user._id,
    channelId: get(user, 'youtube.channelId', '')
  }));
};

module.exports = {
  getChannelIds
};
