'use strict';

var xhr = require('xhr');

var APIUtil = require('../utils/api-util');

var SessionAPI = {

  login: function login(data, cb) {
    data = data || {};

    console.log(data);

    // TODO: setup better domain name
    xhr({
      uri: 'http://localhost:3000/auth/local',
      method: 'POST',
      body: JSON.stringify(data)
    }, function response(err, res, body) {
      if (!err && res.statusCode === 200) {
        var parsedBody = JSON.parse(body);

        return cb(null, parsedBody, res.headers['x-bearer-token']);
      } else {
        return APIUtil.handleError(err, res, cb);
      }
    });
  },

  logout: function logout(cb) {
    // TODO: setup better domain name
    xhr({
      uri: 'http://localhost:3000/auth',
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + APIUtil.getToken()
      }
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

module.exports = SessionAPI;
