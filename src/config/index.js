require("dotenv").config();
const get = require("lodash.get");
const { join } = require("path");

const config = {
  executionID: Date.now(),
  logsFolder: join(__dirname, "..", "..", "logs"),
  mongoUrl: get(process.env, "MONGO_URL", "mongodb://localhost:27017"),
  dbName: get(process.env, "DB_NAME", "db"),
  defaultLimit: get(process.env, "LIMIT_VIDEOS", 200),
  youtubeAPIKey: get(process.env, "YOUTUBE_API_KEY", "youtubeapikey"),
  youtubeMaxIdsSize: get(process.env, "YOUTUBE_MAX_IDS_SIZE", 50)
};

module.exports = config;
