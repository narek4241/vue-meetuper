module.exports = {
  PORT: process.env.PORT || process.env.NODE_PORT, //
  NODE_ENV: process.env.NODE_ENV, //

  MONGO_URI: process.env.MONGO_URI,
  SESSION_SECRET: process.env.SESSION_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,

  DOMAIN_NAME: process.env.DOMAIN_NAME,

  GOOGLE_USER: process.env.GOOGLE_USER,
  GOOGLE_PASSWORD: process.env.GOOGLE_PASSWORD,
};
