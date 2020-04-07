const moment = require('moment');
const reduce = require('lodash.reduce');
const get = require('lodash.get');

const processNumber = function (timeNumber) {
  return timeNumber < 10 ? `0${timeNumber}` : timeNumber;
};

const parseDuration = function (duration) {
  if (!duration) {
    return { duration: 0, durationTime: '00:00' };
  }
  const momentDuration = moment.duration(duration);

  return {
    duration: momentDuration.as('seconds'),
    durationTime: `${processNumber(
      momentDuration.get('minutes')
    )}:${processNumber(momentDuration.get('seconds'))}`
  };
};

const generateThumbnailOptions = function (thumbnailData) {
  const thumbnail = reduce(
    thumbnailData,
    function (result, { url, width = 0 }) {
      if (!width) {
        return result;
      }
      if (width <= 640 && width > get(result, 'width', 0)) {
        return {
          url,
          width
        };
      }
      return result;
    },
    {
      url: '',
      width: 0
    }
  );
  return get(thumbnail, 'url', '');
};

const processThumbnail = function (thumbnailData) {
  return generateThumbnailOptions(thumbnailData);
};

module.exports = {
  parseDuration,
  generateThumbnailOptions,
  processThumbnail,
  processNumber
};
