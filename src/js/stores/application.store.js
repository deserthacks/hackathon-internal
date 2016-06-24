const assign = require('object-assign');
const EventEmitter = require('events').EventEmitter;
const Immutable = require('immutable');

const AppDispatcher = require('../dispatchers/app.dispatcher');
const ApplicationAPI = require('../apis/application.api');
const ApplicationConstants = require('../constants/application.constants');
const SessionConstants = require('../constants/session.constants');

let applications = new Immutable.List();

function clearApplications() {
  applications = applications.clear();
}

function storeApplication(application = {}) {
  const immutableApplication = Immutable.fromJS(application);
  let key;

  const alreadyStored = applications.find((item, index) => {
    key = index;
    return item.get('_id') === application._id;
  });

  if (alreadyStored) {
    applications = applications.update(key, (currentApplication) => (
      immutableApplication
    ));
  } else {
    applications = applications.push(immutableApplication);
  }
}

function storeApplications(apps) {
  applications = applications.clear();

  for (let i = 0; i < apps.length; i++) {
    const app = Immutable.fromJS(apps[i]);
    applications = apps.push(app);
  }
}

const ApplicationStore = assign(EventEmitter.prototype, {

  get: function get(index) {
    return applications[index];
  },

  getApplication: function getApplication(id) {
    const application = applications.find((item) => (
      item.get('_id') === id
    ));

    if (application) {
      return application.toJS();
    }

    return ApplicationAPI.getApplication({ id }, (err, res) => (
      res
    ));
  },

  getApplications: function getApplications() {
    return applications.toJS();
  },

  getStats: function getStats() {
    return {};
  },

  addChangeListener: (callback) => {
    this.on(ApplicationConstants.CHANGE_EVENT, callback);
  },

  removeChangeListener: (callback) => {
    this.removeListener(ApplicationConstants.CHANGE_EVENT, callback);
  },

  emitChange: () => {
    this.emit(ApplicationConstants.CHANGE_EVENT);
  },

  dispatcherIndex: AppDispatcher.register((payload) => {
    const action = payload.action;

    switch (action) {
      case SessionConstants.ActionTypes.UPDATE_CURRENT_HACKATHON:
      case SessionConstants.ActionTypes.CLEAR_CURRENT_HACKATHON:
        clearApplications();
        ApplicationStore.emitChange();
        // falls through
      case ApplicationConstants.ActionTypes.GET_APPLICATIONS:
        ApplicationAPI.getApplications(action.options, () => {

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
        ApplicationAPI.acceptApplication(payload.data, (err, res) => {
          storeApplication(res);
          ApplicationStore.emitChange();
        });
        break;

      case ApplicationConstants.ActionTypes.REJECT_APPLICATION:
        ApplicationAPI.rejectApplication(payload.data, (err, res) => {
          storeApplication(res);
          ApplicationStore.emitChange();
        });
        break;

      default:
        // do nothing
        break;
    }
  }),

});

module.exports = ApplicationStore;
