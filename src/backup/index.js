const { executionID, logsFolder } = require('../config');
const { existsSync, mkdirSync, appendFileSync } = require('fs');

const checkFolders = function () {
  if (!existsSync(logsFolder)) {
    console.log(`creating logs folder: ${logsFolder}`);
    mkdirSync(logsFolder);
  }

  const executionFolder = `${logsFolder}/${executionID}`;
  if (!existsSync(executionFolder)) {
    console.log(`creating execution folder: ${executionFolder}`);
    mkdirSync(executionFolder);
  }

  return executionFolder;
};

const saveToDisc = function (channelId = '', videoIds = []) {
  const logsPath = checkFolders(channelId);
  console.log(`successfully save to disc: ${channelId}`);
  const filePath = `${logsPath}/${channelId}.txt`;
  try {
    appendFileSync(filePath, videoIds.join('\n'), 'utf8');
    console.log(`saved to disc: ${filePath}`);
  } catch (err) {
    console.log(`error writing file: ${filePath}`);
  }
};

module.exports = {
  checkFolders,
  saveToDisc
};
