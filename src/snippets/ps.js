const { Pool } = require("pg");
const asyncRedis = require("async-redis");
const redis = asyncRedis.createClient();

let credentials = {};
if (process.env.HOSTING_PLATFORM === "local") {
  credentials = {
    connectionString: process.env.LOCAL_DATABASE_URL,
  };
} else if (process.env.HOSTING_PLATFORM === "heroku") {
  credentials = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  };
}
else if (process.env.HOSTING_PLATFORM === "qovery") {
  credentials = {
    connectionString: process.env.QOVERY_DATABASE_MY_DB_CONNECTION_URI
  };
}

const postgres = new Pool(credentials)
sql = (text) =>  postgres.query(text) ;
module.exports.sql = sql;
module.exports.redis = redis;