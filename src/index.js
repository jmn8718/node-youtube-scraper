const { connect, close } = require("./db");
const { crawlChannels } = require("./crawl");
const { getChannelIds } = require("./controllers/users");
const { saveToDisc } = require("./backup");

const init = async function() {
  try {
    await connect();

    const channelIds = await getChannelIds({ limit: 2 });
    const results = await crawlChannels(channelIds);

    results.forEach(({ _id, channelId, videoIds }) => {
      console.log(_id, channelId, videoIds);
      return saveToDisc(channelId, videoIds);
    });

    await close();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

init();
