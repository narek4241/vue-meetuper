module.exports = {
  PORT: process.env.PORT || process.env.NODE_PORT || 3001,
  MONGO_URI:
    process.env.MONGO_URI ||
    `mongodb+srv://meetuperUser:4vAoXnbKV3KcsvFm@meetupercluster.u9dws.mongodb.net/vue-meetuper?retryWrites=true&w=majority`,
  NODE_ENV: process.env.NODE_ENV || `development`,
};
