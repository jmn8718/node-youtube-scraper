const axios = require("axios");
const { map } = require("bluebird");
const get = require("lodash.get");
const mapArray = require("lodash.map");
const chunk = require("lodash.chunk");
const flatten = require("lodash.flatten");

const { youtubeAPIKey, youtubeMaxIdsSize } = require("../config");
const { parseDuration, processThumbnail } = require("./utils");

const YT_API_PATH = "https://www.googleapis.com/youtube/v3";
const YT_API_VIDEOS = `${YT_API_PATH}/videos`;

const processYoutubeData = function(data) {
  const rawDuration = get(data, "contentDetails.duration", 0);
  const { durationTime, duration } = parseDuration(rawDuration);
  return {
    youtubeId: get(data, "id", ""),
    title: get(data, "snippet.title", ""),
    description: get(data, "snippet.description", ""),
    channelId: get(data, "snippet.channelId", ""),
    publishedAt: get(data, "snippet.publishedAt", ""),
    channelTitle: get(data, "snippet.channelTitle", ""),
    tags: get(data, "snippet.tags", []),
    language: get(data, "snippet.defaultAudioLanguage", ""),
    captions: get(data, "contentDetails.caption", "false") === "true",
    rawDuration,
    duration,
    durationTime,
    thumbnail: processThumbnail(get(data, "snippet.thumbnails", {}))
  };
};

const queryAPI = async function(path, params = {}) {
  const response = await axios(path, {
    params: {
      key: youtubeAPIKey,
      ...params
    }
  });

  // TODO handle response status
  const { data } = response;
  return data;
};

const queryYoutubeVideoById = async function(id) {
  const response = await queryAPI(YT_API_VIDEOS, {
    id,
    part: "snippet,contentDetails" // statistics
  });
  const items = get(response, "items", []);
  return mapArray(items, processYoutubeData);
};

const queryYoutubeVideosByIds = function(videoIds = []) {
  return queryYoutubeVideoById(videoIds.join(","));
};

const getVideosData = async function(videoIds = []) {
  const videoDataFromApi = [];
  if (videoIds.length > youtubeMaxIdsSize) {
    const responses = await map(
      chunk(videoIds, youtubeMaxIdsSize),
      queryYoutubeVideosByIds,
      { concurrency: 3 }
    );
    videoDataFromApi.push(...responses);
  } else if (videoIds.length > 0) {
    const response = await queryYoutubeVideosByIds(videoIds);
    videoDataFromApi.push(response);
  }
  return flatten(videoDataFromApi);
};

module.exports = {
  queryYoutubeVideoById,
  queryYoutubeVideosByIds,
  processYoutubeData,
  getVideosData
};
