// constants.js
const dotenv = require("dotenv");
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const APIKEY = process.env.APIKEY;
const DEVICEID = process.env.DEVICEID;
const FACEBOOK_PAGE = process.env.FACEBOOK_PAGE_ID;
const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

module.exports = {
  jwtSecret,
  PORT,
  MONGODB_URI,
  APIKEY,
  DEVICEID,
  FACEBOOK_PAGE,
  ACCESS_TOKEN,
};
