const axios = require('axios');

const { apiEndpoint, apiToken, apiHost } = require('../config');

const VIDEOS_ENDPOINT = `${apiEndpoint}/videos/youtube`;

const publishVideo = async function (videoData) {
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
};

module.exports = {
  publishVideo,
  VIDEOS_ENDPOINT
};
