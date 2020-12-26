const geoip = require('geoip-lite');
// #note run npm run-script updatedb -> to update the data file opt
const request = require('request');

exports.getMeta = (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    // #task #res syntax, usage opt
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);
    return res.json(geo);
  } else {
    request('https://api.ipify.org/?format=json', (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const ip = JSON.parse(response.body).ip;
        const geo = geoip.lookup(ip);
        return res.json(geo);
      } else {
        return res.status(422).send({ errors: 'Cannot get location from IP' });
      }
    });
  }
};
