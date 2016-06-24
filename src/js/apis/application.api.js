const xhr = require('xhr');

const APIUtil = require('../utils/api-util');
const ApplicationActions = require('../actions/application.actions');

// const _token = APIUtil.getToken();

const ApplicationAPI = {

  getApplication: function getApplication(options = {}, cb) {
    // TODO: setup better domain name
    xhr({
      uri: `http://localhost:3000/applications/${options.id}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${APIUtil.getToken()}`,
      },
    }, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        const parsedBody = JSON.parse(body);

        ApplicationActions.getApplicationSuccess(parsedBody);
        return cb(null, parsedBody);
      }
      APIUtil.badResponse(res, (action) => {
        ApplicationActions.getApplicationFailure(action);
      });
      return APIUtil.handleError(err, res, cb);
    });
  },

  getApplications: function getApplications(options = {}, cb) {
    const query = APIUtil.query(options, true);

    // TODO: setup better domain name
    xhr({
      uri: `http://localhost:3000/applications?${query}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${APIUtil.getToken()}`,
      },
    }, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        const parsedBody = JSON.parse(body);

        ApplicationActions.getApplicationsSuccess(parsedBody);
        return cb(null, parsedBody);
      }
      APIUtil.badResponse(res, (action) => {
        ApplicationActions.getApplicationsFailure(action);
      });
      return APIUtil.handleError(err, res, cb);
    });
  },

  getAdjacentApplications: function getAdjacentApplications(options = {}, cb) {
    // TODO: setup better domain name
    xhr({
      uri: `http://localhost:3000/applications/${options.id}/adjacent`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${APIUtil.getToken()}`,
      },
    }, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        const parsedBody = JSON.parse(body);

        return cb(null, parsedBody);
      }
      APIUtil.badResponse(res, () => {
        // do nothing
      });
      return APIUtil.handleError(err, res, cb);
    });
  },

  acceptApplication: function acceptApplication(application, cb) {
    const reqBody = {
      reviewNote: application.reviewNote,
    };

    // TODO: setup better domain name
    xhr({
      uri: `http://localhost:3000/applications/${application._id}/approval`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${APIUtil.getToken()}`,
      },
      body: JSON.stringify(reqBody),
    }, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        const parsedBody = JSON.parse(body);

        return cb(null, parsedBody);
      }
      APIUtil.badResponse(res, () => {
        // do nothing
      });
      return APIUtil.handleError(err, res, cb);
    });
  },

  rejectApplication: function rejectApplication(application, cb) {
    const reqBody = {
      reviewNote: application.reviewNote,
    };

    // TODO: setup better domain name
    xhr({
      uri: `http://localhost:3000/applications/${application._id}/rejection`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${APIUtil.getToken()}`,
      },
      body: JSON.stringify(reqBody),
    }, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        const parsedBody = JSON.parse(body);

        return cb(null, parsedBody);
      }
      APIUtil.badResponse(res, () => {
        // do nothing
      });
      return APIUtil.handleError(err, res, cb);
    });
  },

  getApplicationConfigs: function getApplicationConfigs(options = {}, cb) {
    const query = APIUtil.query(options, true);

    xhr({
      uri: `http://localhost:3000/applications/configs?${query}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${APIUtil.getToken()}`,
      },
    }, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        const parsedBody = JSON.parse(body);

        return cb(null, parsedBody);
      }
      APIUtil.badResponse(res, () => {
        // do nothing
      });
      return APIUtil.handleError(err, res, cb);
    });
  },

  updateApplicationConfig: function updateApplicationConfig(application, cb) {
    if (!application) {
      cb('application required', null);
    }

    xhr({
      uri: `http://localhost:3000/applications/configs/${application._id}`,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${APIUtil.getToken()}`,
      },
      body: JSON.stringify(application),
    }, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        const parsedBody = JSON.parse(body);

        return cb(null, parsedBody);
      }
      APIUtil.badResponse(res, () => {
        // do nothing
      });
      return APIUtil.handleError(err, res, cb);
    });
  },

};

module.exports = ApplicationAPI;
