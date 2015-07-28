'use strict';

var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatchers/app.dispatcher');
var SessionAPI = require('../apis/session.api');
var SessionConstants = require('../constants/session.constants');

// TODO: use immutable.js here
var _user;
var _hackathon;

/**
 * Get an object from localStorage
 *
 * @param {String} entity - Name of object in localStorage
 * @return {Object} JSON parsed object
 */
function getFromLocalStorage(entity) {
  var data = window.localStorage.getItem(entity);

  return JSON.parse(data);
}

/**
 * Store a JSON stringified object in localStorage
 *
 * @param {String} entity - Name to give in localStorage
 * @param {Object} data - Data to be stringified and stored
 */
function setLocalStorage(entity, data) {
  var parsedObject = JSON.stringify(data);

  window.localStorage.setItem(entity, parsedObject);
}

function setCurrentHackathon(hackathon) {
  _hackathon = hackathon;
  setLocalStorage('hackathon', _hackathon);
}

function setUser(data) {
  _user = data;
  setLocalStorage('user', _user);
}

function clearUser() {
  _user = undefined;
}

function clearHackathon() {
  _hackathon = undefined;
}

function clearLocalStorage() {
  setLocalStorage('token', '');
  setLocalStorage('user', '');
  setLocalStorage('hackathon', '');
  clearUser();
  clearHackathon();
}

var SessionStore = assign(EventEmitter.prototype, {

  getCurrentUser: function getCurrentUser() {
    var user = getFromLocalStorage('user');

    return user || _user;
  },

  getCurrentToken: function getCurrentToken() {
    var token = getFromLocalStorage('token');

    return token;
  },

  getCurrentHackathon: function getCurrentHackathon() {
    var hackathon = getFromLocalStorage('hackathon');

    return _hackathon || hackathon;
  },

  addChangeListener: function addChangeListener(callback) {
    this.on(SessionConstants.CHANGE_EVENT, callback);
  },

  removeChangeListener: function removeChangeListener(callback) {
    this.removeListener(SessionConstants.CHANGE_EVENT, callback);
  },

  emitChange: function emitChange() {
    this.emit(SessionConstants.CHANGE_EVENT);
  },

  dispatcherIndex: AppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action) {

      case SessionConstants.ActionTypes.LOGIN:
        SessionAPI.login(payload.data, function(err, res, token) {
          if (res && token) {
            setLocalStorage('token', token);
            setUser(res);
          }
          SessionStore.emitChange();
        });
        break;

      case SessionConstants.ActionTypes.LOGOUT:
        SessionAPI.logout(function() {
          clearLocalStorage();
          SessionStore.emitChange();
        });
        break;

      case SessionConstants.ActionTypes.CLEAR_TOKEN:
        clearLocalStorage();
        SessionStore.emitChange();
        break;

      case SessionConstants.ActionTypes.UPDATE_CURRENT_HACKATHON:
        setCurrentHackathon(payload.data);
        SessionStore.emitChange();
        break;

      case SessionConstants.ActionTypes.CLEAR_CURRENT_HACKATHON:
        setLocalStorage('hackathon', '');
        clearHackathon();
        SessionStore.emitChange();
        break;

    }
  })

});

module.exports = SessionStore;
