'use strict';

var xhr = require('xhr');

var APIUtil = require('../utils/api-util');

var HackathonAPI = {

  getHackathons: function getHackathons(cb) {
    // TODO: setup better domain name
    xhr({
      uri: 'http://localhost:3000/hackathons',
      method: 'GET'
    }, function response(err, res, body) {
      if (!err && res.statusCode === 200) {
        var parsedBody = JSON.parse(body);

        return cb(null, parsedBody);
      } else {
        return APIUtil.handleError(err, res, cb);
      }
    });
  }

};

module.exports = HackathonAPI;
