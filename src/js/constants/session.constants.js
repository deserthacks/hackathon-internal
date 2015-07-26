'use strict';

var keyMirror = require('react/lib/keyMirror');

module.exports = {

  CHANGE_EVENT: 'change',

  ActionTypes: keyMirror({
    LOGIN: null,
    LOGOUT: null,
    CLEAR_TOKEN: null,
    GET_CURRENT_USER: null,
  }),

  ActionSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  })

};
