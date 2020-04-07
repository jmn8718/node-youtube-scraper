require('dotenv').config();
const get = require('lodash.get');
const { join } = require('path');

const pupperterConfig = {};
const browserWSEndpoint = get(process.env, 'BROWSER_WS_ENDPOINT');
if (browserWSEndpoint) {
  pupperterConfig.browserWSEndpoint = browserWSEndpoint;
}

const config = {
  executionID: Date.now(),
  logsFolder: join(__dirname, '..', '..', 'logs'),
  mongoUrl: get(process.env, 'MONGO_URL', 'mongodb://localhost:27017'),
  dbName: get(process.env, 'DB_NAME', 'db'),
  defaultLimit: parseInt(get(process.env, 'LIMIT_VIDEOS', 200)),
  youtubeAPIKey: get(process.env, 'YOUTUBE_API_KEY', 'youtubeapikey'),
  youtubeMaxIdsSize: parseInt(get(process.env, 'YOUTUBE_MAX_IDS_SIZE', 50)),
  apiHost: get(process.env, 'API_HOST', 'apikey'),
  apiEndpoint: get(process.env, 'API_ENDPOINT', 'apikey'),
  apiToken: get(process.env, 'API_TOKEN', 'apitoken'),
  pupperterConfig
};

module.exports = config;
