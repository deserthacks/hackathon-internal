const xhr = require('xhr');

const APIUtil = require('../utils/api-util');

const HackathonAPI = {
  getHackathons: function getHackathons(cb) {
    // TODO: setup better domain name
    xhr({
      uri: 'http://localhost:3000/hackathons',
      method: 'GET',
    }, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        const parsedBody = JSON.parse(body);

        return cb(null, parsedBody);
      }
      return APIUtil.handleError(err, res, cb);
    });
  },
};

module.exports = HackathonAPI;
