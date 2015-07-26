'use strict';

var SessionActions = require('../actions/session.actions');

var APIUtil = {

  /**
   * Function used to handle a bad response
   *
   * @param {Object} res
   * @return {Object} action
   */
  badResponse: function badResponse(res) {
    if (res.statusCode === 401) {
      console.log('%s: logging user out', res.body);
      SessionActions.clearToken();
    }
  },

  getToken: function getToken() {
    var token = window.localStorage.getItem('token');
    return JSON.parse(token);
  },

  handleError: function handleError(err, res, cb) {
    cb = cb || console.log;
    console.log(err, res, cb);
    if (!err) {
      return cb(res, null);
    } else {
      return cb(err, null);
    }
  }

};

module.exports = APIUtil;
