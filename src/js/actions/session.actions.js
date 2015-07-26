'use strict';

var AppDispatcher = require('../dispatchers/app.dispatcher');
var SessionConstants = require('../constants/session.constants');

var SessionActions = {

  login: function login(options) {
    AppDispatcher.dispatch({
      action: SessionConstants.ActionTypes.LOGIN,
      data: options
    });
  },

  logout: function logout() {
    AppDispatcher.dispatch({
      action: SessionConstants.ActionTypes.LOGOUT
    });
  },

  clearToken: function clearToken() {
    AppDispatcher.dispatch({
      action: SessionConstants.ActionTypes.CLEAR_TOKEN
    });
  },

  getCurrentUser: function getCurrentUser(response) {
    AppDispatcher.dispatch({
      action: SessionConstants.ActionTypes.GET_CURRENT_USER,
      data: response
    });
  }

};

module.exports = SessionActions;
