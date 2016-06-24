const qs = require('qs');

const SessionActions = require('../actions/session.actions');

const APIUtil = {

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
    const token = window.localStorage.getItem('token');

    return JSON.parse(token);
  },

  /**
   * Get the current hackathon from localStorage
   *
   * @return {Object} hackathon
   */
  getHackathon: function getHackathon() {
    const hackathon = window.localStorage.getItem('hackathon');

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
    const callback = cb || console.log;

    if (!err) {
      return callback(res, null);
    }

    return callback(err, null);
  },

  query: function query(options = {}, filterHackathon) {
    if (filterHackathon) {
      options.hackathon = this.getHackathon()._id;
    }

    return qs.stringify(options);
  },

};

module.exports = APIUtil;
