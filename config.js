module.exports = {
  PORT: process.env.PORT || process.env.NODE_PORT || 3001,
  MONGO_URI: process.env.MONGO_URI || `mongodb://localhost:27017/vue-meetuper`,
  NODE_ENV: process.env.NODE_ENV || `development`,
};
