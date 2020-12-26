module.exports = {
  PORT: process.env.PORT || process.env.NODE_PORT || 3001, //
  NODE_ENV: process.env.NODE_ENV || 'development', //

  MONGO_URI:
    process.env.MONGO_URI ||
    'mongodb+srv://meetuperUser:4vAoXnbKV3KcsvFm@meetupercluster.u9dws.mongodb.net/vue-meetuper?retryWrites=true&w=majority',
  SESSION_SECRET: process.env.SESSION_SECRET || 'cbykQK7BB+gB+&vG',
  JWT_SECRET: process.env.JWT_SECRET || 'WCK%aK7ZN#gB:&&H',
};
