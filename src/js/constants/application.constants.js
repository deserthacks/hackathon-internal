'use strict';

var keyMirror = require('react/lib/keyMirror');

module.exports = {

  CHANGE_EVENT: 'change',

  ActionTypes: keyMirror({
    GET_APPLICATIONS: null,
    GET_APPLICATIONS_SUCCESS: null,
    GET_APPLICATIONS_FAILURE: null,

    GET_APPLICATION_SUCCESS: null,
    GET_APPLICATION_FAILURE: null,

    ACCEPT_APPLICATION: null,
    REJECT_APPLICATION: null
  }),

  ActionSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  })

};
