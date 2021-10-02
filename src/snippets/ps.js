const { Pool } = require("pg");
const asyncRedis = require("async-redis");
const redis = asyncRedis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1'
});
redis.on('connect', () => console.log("Redis connected", process.env.LOCAL_DATABASE_URL))
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


const postgres = new Pool(credentials)
sql = (text,param) =>  postgres.query(text,param) ;
module.exports.sql = sql;
module.exports.redis = redis;