const AppDispatcher = require('../dispatchers/app.dispatcher');
const SessionConstants = require('../constants/session.constants');

const SessionActions = {

  login: function login(options) {
    AppDispatcher.dispatch({
      action: SessionConstants.ActionTypes.LOGIN,
      data: options,
    });
  },

  logout: function logout() {
    AppDispatcher.dispatch({
      action: SessionConstants.ActionTypes.LOGOUT,
    });
  },

  clearToken: function clearToken() {
    AppDispatcher.dispatch({
      action: SessionConstants.ActionTypes.CLEAR_TOKEN,
    });
  },

  getCurrentUser: function getCurrentUser(response) {
    AppDispatcher.dispatch({
      action: SessionConstants.ActionTypes.GET_CURRENT_USER,
      data: response,
    });
  },

  updateCurrentHackathon: function updateCurrentHackathon(hackathon) {
    AppDispatcher.dispatch({
      action: SessionConstants.ActionTypes.UPDATE_CURRENT_HACKATHON,
      data: hackathon,
    });
  },

  clearCurrentHackathon: function clearCurrentHackathon() {
    AppDispatcher.dispatch({
      action: SessionConstants.ActionTypes.CLEAR_CURRENT_HACKATHON,
    });
  },

};

module.exports = SessionActions;
