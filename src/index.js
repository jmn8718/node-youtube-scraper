const { connect, close } = require("./db");
const { crawlChannels } = require("./crawl");
const { getChannelIds } = require("./controllers/users");

const init = async function() {
  try {
    await connect();

    const channelIds = await getChannelIds({ limit: 0 });
    await crawlChannels(channelIds);

    await close();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

init();
