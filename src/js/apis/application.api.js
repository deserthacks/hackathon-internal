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

    var query = APIUtil.query(options, true);

    // TODO: setup better domain name
    xhr({
      uri: 'http://localhost:3000/applications?' + query,
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

  getAdjacentApplications: function getAdjacentApplications(options, cb) {
    options = options || {};

    // TODO: setup better domain name
    xhr({
      uri: 'http://localhost:3000/applications/' + options.id + '/adjacent',
      method: 'GET',
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

  acceptApplication: function acceptApplication(application, cb) {
    var body = {
      reviewNote: application.reviewNote
    };

    // TODO: setup better domain name
    xhr({
      uri: 'http://localhost:3000/applications/' + application._id + '/approval',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + APIUtil.getToken()
      },
      body: JSON.stringify(body)
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
    var body = {
      reviewNote: application.reviewNote
    };

    // TODO: setup better domain name
    xhr({
      uri: 'http://localhost:3000/applications/' + application._id + '/rejection',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + APIUtil.getToken()
      },
      body: JSON.stringify(body)
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

  getApplicationConfigs: function getApplicationConfigs(options, cb) {
    options = options || {};

    var query = APIUtil.query(options, true);

    xhr({
      uri: 'http://localhost:3000/applications/configs?' + query,
      method: 'GET',
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

  updateApplicationConfig: function updateApplicationConfig(application, cb) {
    if (!application) {
      cb('application required', null);
    }

    xhr({
      uri: 'http://localhost:3000/applications/configs/' + application._id,
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + APIUtil.getToken()
      },
      body: JSON.stringify(application)
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
