require("dotenv").config();
const get = require("lodash.get");

const config = {
  mongoUrl: get(process.env, "MONGO_URL", "mongodb://localhost:27017"),
  dbName: get(process.env, "DB_NAME", "db")
};

module.exports = config;
