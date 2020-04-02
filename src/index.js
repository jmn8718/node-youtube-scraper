const { connect, close } = require("./db");
const { crawl } = require("./crawl");

const crawlChannel = async function(channelId) {
  const videoIds = await crawl(channelId, 120);
  console.log(videoIds);
};

const init = async function() {
  await connect();

  crawlChannel("UCQX_MZRCaluNKxkywkLEgfA");

  await close();
};

init();
