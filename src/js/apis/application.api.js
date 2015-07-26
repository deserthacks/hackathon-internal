'use strict';

var xhr = require('xhr');

var APIUtil = require('../utils/api-util');
var ApplicationActions = require('../actions/application.actions');

//var _token = APIUtil.getToken();

var ApplicationAPI = {

  getApplication: function getApplication(options, cb) {
    options = options || {};

    // TODO: setup better domain name
    xhr({
      uri: 'http://localhost:3000/applications/' + options.id,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + APIUtil.getToken()
      }
    }, function response(err, res, body) {
      if (!err && res.statusCode === 200) {
        var parsedBody = JSON.parse(body);

        ApplicationActions.getApplicationSuccess(parsedBody);
        return cb(null, parsedBody);
      } else {
        APIUtil.badResponse(res, function(action) {
          ApplicationActions.getApplicationFailure(action);
        });
        return APIUtil.handleError(err, res, cb);
      }
    });
  },

  getApplications: function getApplications(options, cb) {
    options = options || {};

    // TODO: setup better domain name
    xhr({
      uri: 'http://localhost:3000/applications',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + APIUtil.getToken()
      }
    }, function response(err, res, body) {
      if (!err && res.statusCode === 200) {
        var parsedBody = JSON.parse(body);

        ApplicationActions.getApplicationsSuccess(parsedBody);
        return cb(null, parsedBody);
      } else {
        APIUtil.badResponse(res, function(action) {
          ApplicationActions.getApplicationsFailure(action);
        });
        return APIUtil.handleError(err, res, cb);
      }
    });
  },

  acceptApplication: function acceptApplication(application, cb) {
    // TODO: setup better domain name
    xhr({
      uri: 'http://localhost:3000/applications/' + application._id + '/approval',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + APIUtil.getToken()
      }
    }, function response(err, res, body) {
      if (!err && res.statusCode === 200) {
        var parsedBody = JSON.parse(body);

        return cb(null, parsedBody);
      } else {
        APIUtil.badResponse(res, function() {

        });
        return APIUtil.handleError(err, res, cb);
      }
    });
  },

  rejectApplication: function rejectApplication(application, cb) {
    // TODO: setup better domain name
    xhr({
      uri: 'http://localhost:3000/applications/' + application._id + '/rejection',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + APIUtil.getToken()
      }
    }, function response(err, res, body) {
      if (!err && res.statusCode === 200) {
        var parsedBody = JSON.parse(body);

        return cb(null, parsedBody);
      } else {
        APIUtil.badResponse(res, function() {
        });
        return APIUtil.handleError(err, res, cb);
      }
    });
  }

};

module.exports = ApplicationAPI;
