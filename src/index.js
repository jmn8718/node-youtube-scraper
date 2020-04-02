const { connect, close } = require("./db");
const { crawlChannels } = require("./crawl");
const { getChannelIds } = require("./controllers/users");

const init = async function() {
  await connect();

  const channelIds = await getChannelIds({ limit: 2 });
  const results = await crawlChannels(channelIds);
  // TODO handle results 
  console.log(results);

  await close();
};

init();
