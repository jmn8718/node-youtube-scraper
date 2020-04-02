const { crawl } = require("./crawl");

const crawlChannel = async function(channelId) {
  const videoIds = await crawl(channelId, 120);
  console.log(videoIds);
};

crawlChannel("UCQX_MZRCaluNKxkywkLEgfA");
