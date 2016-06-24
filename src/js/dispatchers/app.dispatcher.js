const Dispatcher = require('flux').Dispatcher;
const Constants = require('../constants/application.constants');
const assign = require('object-assign');

const AppDispatcher = assign(new Dispatcher(), {

  handleServerAction: (action) => {
    const payload = {
      source: Constants.ActionSources.SERVER_ACTION,
      action,
    };

    this.dispatch(payload);
  },

  handleViewAction: (action) => {
    const payload = {
      source: Constants.ActionSources.VIEW_ACTION,
      action,
    };

    this.dispatch(payload);
  },

});

module.exports = AppDispatcher;
