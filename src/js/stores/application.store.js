'use strict';

var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');

var AppDispatcher = require('../dispatchers/app.dispatcher');
var ApplicationAPI = require('../apis/application.api');
var ApplicationConstants = require('../constants/application.constants');
var SessionConstants = require('../constants/session.constants');

var _applications = Immutable.List();

function clearApplications() {
  _applications = _applications.clear();
}

function storeApplication(application) {
  application = application || {};

  var immutableApplication = Immutable.fromJS(application);
  var key;
  var alreadyStored = _applications.find(function find(item, index) {
    key = index;
    return item.get('_id') === application._id;
  });

  if (alreadyStored) {
    _applications = _applications.update(key, function updater(currentApplication) {
      currentApplication = immutableApplication;
      return currentApplication;
    });
  } else {
    _applications = _applications.push(immutableApplication);
  }
}

function storeApplications(applications) {
  _applications = _applications.clear();
  for (var i = 0; i < applications.length; i++) {
    var application = Immutable.fromJS(applications[i]);
    _applications = _applications.push(application);
  }
}

var ApplicationStore = assign(EventEmitter.prototype, {

  get: function get(index) {
    return _applications[index];
  },

  getApplication: function getApplication(id) {
    var application = _applications.find(function find(item) {
      return item.get('_id') === id;
    });

    if (application) {
      return application.toJS();
    } else {
      ApplicationAPI.getApplication({id: id}, function(err, res) {
        return res;
      });
    }
  },

  getApplications: function getApplications() {
    var applications = _applications.toJS();

    return applications;
  },

  getStats: function getStats() {
    return {};
  },

  addChangeListener: function(callback) {
    this.on(ApplicationConstants.CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(ApplicationConstants.CHANGE_EVENT, callback);
  },

  emitChange: function() {
    this.emit(ApplicationConstants.CHANGE_EVENT);
  },

  dispatcherIndex: AppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action) {

      case SessionConstants.ActionTypes.UPDATE_CURRENT_HACKATHON:
      case SessionConstants.ActionTypes.CLEAR_CURRENT_HACKATHON:
        clearApplications();
        ApplicationStore.emitChange();
        // falls through
      case ApplicationConstants.ActionTypes.GET_APPLICATIONS:
        ApplicationAPI.getApplications(action.options, function() {

        });
        break;

      case ApplicationConstants.ActionTypes.GET_APPLICATIONS_SUCCESS:
        storeApplications(payload.data);
        ApplicationStore.emitChange();
        break;

      case ApplicationConstants.ActionTypes.GET_APPLICATION_SUCCESS:
        storeApplication(payload.data);
        ApplicationStore.emitChange();
        break;

      case ApplicationConstants.ActionTypes.ACCEPT_APPLICATION:
        ApplicationAPI.acceptApplication(payload.data, function(err, res) {
          storeApplication(res);
          ApplicationStore.emitChange();
        });
        break;

      case ApplicationConstants.ActionTypes.REJECT_APPLICATION:
        ApplicationAPI.rejectApplication(payload.data, function(err, res) {
          storeApplication(res);
          ApplicationStore.emitChange();
        });
        break;

    }
  })

});

module.exports = ApplicationStore;
