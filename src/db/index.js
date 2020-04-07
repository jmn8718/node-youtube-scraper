const { MongoClient } = require('mongodb');
const { mongoUrl, dbName } = require('../config');

// Create a new MongoClient
const client = new MongoClient(mongoUrl, { useUnifiedTopology: true });
const dbs = {};

const connect = () => {
  console.log('connecting to MONGO');
  if (client.isConnected()) {
    return Promise.resolve();
  }
  return client.connect();
};

const close = () => {
  console.log('close connection to MONGO');
  if (!client.isConnected()) {
    return Promise.resolve();
  }
  return client.close();
};

const getDB = async function (name = dbName) {
  if (!client.isConnected()) {
    await connect();
  }
  if (!dbs[name]) {
    console.log(`Connecting to DB ${name}`);
    dbs[name] = await client.db(name);
  }
  return dbs[name];
};

module.exports = {
  client,
  connect,
  close,
  getDB
};
