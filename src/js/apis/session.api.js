const xhr = require('xhr');

const APIUtil = require('../utils/api-util');

const SessionAPI = {

  login: function login(data = {}, cb) {
    // TODO: setup better domain name
    xhr({
      uri: 'http://localhost:3000/auth/local',
      method: 'POST',
      body: JSON.stringify(data),
    }, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        const parsedBody = JSON.parse(body);

        return cb(null, parsedBody, res.headers['x-bearer-token']);
      }

      return APIUtil.handleError(err, res, cb);
    });
  },

  logout: function logout(cb) {
    // TODO: setup better domain name
    xhr({
      uri: 'http://localhost:3000/auth',
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${APIUtil.getToken()}`,
      },
    }, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        const parsedBody = JSON.parse(body);

        return cb(null, parsedBody);
      }

      return APIUtil.handleError(err, res, cb);
    });
  },

};

module.exports = SessionAPI;
