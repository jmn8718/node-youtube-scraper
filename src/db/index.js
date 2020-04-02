const { MongoClient } = require("mongodb");
const { mongoUrl, dbName } = require("../config");

// Create a new MongoClient
const client = new MongoClient(mongoUrl, { useUnifiedTopology: true });
let db;

const connect = () => {
  console.log("connecting to MONGO");
  if (client.isConnected()) {
    return Promise.resolve();
  }
  return client.connect();
};

const close = () => {
  console.log("close connection to MONGO");
  if (!client.isConnected()) {
    return Promise.resolve();
  }
  return client.close();
};

const getDB = async function() {
  if (!client.isConnected()) {
    await connect();
  }
  if (!db) {
    console.log(`Connecting to DB ${dbName}`);
    db = await client.db(dbName);
  }
  return db;
};

module.exports = {
  client,
  connect,
  close,
  getDB
};
