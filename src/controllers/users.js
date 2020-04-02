const get = require("lodash.get");
const { getDB } = require("../db");

const getChannelIds = async function(options = {}) {
  const db = await getDB();

  const users = await db
    .collection("users")
    .find(
      {
        "youtube.channelId": { $exists: true }
      },
      {
        projection: {
          "youtube.channelId": 1
        },
        limit: get(options, "limit", 0),
        skip: get(options, "skip", 0)
      }
    )
    .toArray();

  return users.map(user => ({
    _id: user._id,
    channelId: get(user, "youtube.channelId", "")
  }));
};

module.exports = {
  getChannelIds
};
