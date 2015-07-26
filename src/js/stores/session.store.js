'use strict';

var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatchers/app.dispatcher');
var SessionAPI = require('../apis/session.api');
var SessionConstants = require('../constants/session.constants');

// TODO: use immutable.js here
var _user;

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

function clearUser() {
  _user = undefined;
}

function clearLocalStorage() {
  setLocalStorage('token', '');
  setLocalStorage('user', '');
  clearUser();
}

function setUser(data) {
  _user = data;
  setLocalStorage('user', _user);
}

var SessionStore = assign(EventEmitter.prototype, {

  getCurrentUser: function getCurrentUser() {
    var user = getFromLocalStorage('user');
    return user || _user;
  },

  getCurrentToken: function getCurrentToken() {
    var token = getFromLocalStorage('token');
    console.log('token: %O', token);
    return getFromLocalStorage(token);
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
    console.log(payload);
    var action = payload.action;

    switch(action) {

      case SessionConstants.ActionTypes.LOGIN:
        console.log('login in user');
        SessionAPI.login(payload.data, function(err, res, token) {
          console.log(res);
          if (res && token) {
            setLocalStorage('token', token);
            setUser(res);
          }
          SessionStore.emitChange();
        });
        break;

      case SessionConstants.ActionTypes.LOGOUT:
        console.log('logging out user');
        SessionAPI.logout(function() {
          setLocalStorage('token', '');
          setLocalStorage('user', '');
          clearUser();
          SessionStore.emitChange();
        });
        break;

      case SessionConstants.ActionTypes.CLEAR_TOKEN:
        console.log('clearing local storage');
        clearLocalStorage();
        SessionStore.emitChange();
        break;

    }
  })

});

module.exports = SessionStore;
