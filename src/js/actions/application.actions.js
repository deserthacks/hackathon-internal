'use strict';

var AppDispatcher = require('../dispatchers/app.dispatcher');
var ApplicationConstants = require('../constants/application.constants');

var ApplicationActions = {

  getApplication: function getApplication(options) {
    AppDispatcher.dispatch({
      action: ApplicationConstants.ActionTypes.GET_APPLICATION,
      data: options
    });
  },

  getApplicationSuccess: function getApplicationSuccess(response) {
    AppDispatcher.dispatch({
      action: ApplicationConstants.ActionTypes.GET_APPLICATION_SUCCESS,
      data: response
    });
  },

  getApplicationFailure: function getApplicationFailure(response) {
    AppDispatcher.dispatch({
      action: ApplicationConstants.ActionTypes.GET_APPLICATION_FAILURE,
      data: response
    });
  },

  getApplications: function getApplications(options) {
    AppDispatcher.dispatch({
      action: ApplicationConstants.ActionTypes.GET_APPLICATIONS,
      data: options
    });
  },

  getApplicationsSuccess: function getApplicationsSuccess(response) {
    AppDispatcher.dispatch({
      action: ApplicationConstants.ActionTypes.GET_APPLICATIONS_SUCCESS,
      data: response
    });
  },

  getApplicationsFailure: function getApplicationsFailure(response) {
    AppDispatcher.dispatch({
      action: ApplicationConstants.ActionTypes.GET_APPLICATIONS_FAILURE,
      data: response
    });
  },

  acceptApplication: function acceptApplication(application) {
    AppDispatcher.dispatch({
      action: ApplicationConstants.ActionTypes.ACCEPT_APPLICATION,
      data: application
    });
  },

  rejectApplication: function rejectApplication(application) {
    AppDispatcher.dispatch({
      action: ApplicationConstants.ActionTypes.REJECT_APPLICATION,
      data: application
    });
  }

};

module.exports = ApplicationActions;
