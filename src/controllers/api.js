const axios = require('axios');
const get = require('lodash.get');
const { apiEndpoint, apiToken, apiHost } = require('../config');

const VIDEOS_ENDPOINT = `${apiEndpoint}/videos/youtube`;

const publishVideo = async function (videoData) {
  try {
    const response = await axios({
      method: 'POST',
      url: `${apiHost}${VIDEOS_ENDPOINT}`,
      data: videoData,
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    });

    // TODO handle response status
    const { data } = response;
    return data;
  } catch (err) {
    const errorData = get(err, 'response.data');
    if (errorData) {
      console.log(videoData.youtubeId, err.response.status, err.response.data);
      return errorData;
    }
    throw err;
  }
};

module.exports = {
  publishVideo,
  VIDEOS_ENDPOINT
};
