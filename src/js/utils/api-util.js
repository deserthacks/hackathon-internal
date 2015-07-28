'use strict';

var qs = require('qs');

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
      SessionActions.clearToken();
    }
  },

  /**
   * Get the current user's token from localStorage
   *
   * @return {String} token
   */
  getToken: function getToken() {
    var token = window.localStorage.getItem('token');

    return JSON.parse(token);
  },

  /**
   * Get the current hackathon from localStorage
   *
   * @return {Object} hackathon
   */
  getHackathon: function getHackathon() {
    var hackathon = window.localStorage.getItem('hackathon');

    return JSON.parse(hackathon);
  },

  /**
   * Handles browser API errors apart from
   * request errors
   *
   * @param {Objectt} err - Error from browser
   * @param {Objectt} res - API response
   * @param {Function} cb - Original API function callback
   * @return {Function} callback
   */
  handleError: function handleError(err, res, cb) {
    cb = cb || console.log;

    if (!err) {
      return cb(res, null);
    } else {
      return cb(err, null);
    }
  },

  query: function query(options, filterHackathon) {
    options = options || {};

    if (filterHackathon) {
      var hackathon = this.getHackathon();
      options.hackathon = hackathon._id;
    }

    return qs.stringify(options);
  }

};

module.exports = APIUtil;
