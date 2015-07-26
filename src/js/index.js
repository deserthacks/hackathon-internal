'use strict';

var React = require('react');
var Router = require('react-router');
var h = require('react-hyperscript');

var App = require('./components/handlers/app');
var ApplicationEditor = require('./components/handlers/application-editor');
var ApplicationHandler = require('./components/handlers/application-handler');
var ApplicationIndex = require('./components/application-index');
var ApplicationPage = require('./components/handlers/application-page');
var AuthUtil = require('./utils/auth-util');
var Dashboard = require('./components/handlers/dashboard');
var LoginPage = require('./components/handlers/login-page');

var routes = (
  h(Router.Route, {name: 'root', path: '/', handler: App}, [
    h(Router.DefaultRoute, {name: 'dashboard', handler: Dashboard}),
    h(Router.Route, {name: 'login', path: '/login', handler: LoginPage}),
    h(Router.Route, {
      name: 'applications',
      path: '/applications',
      handler: ApplicationHandler,
      onEnter: AuthUtil.authenticated,
      onLeave: function(nextState, transition) {
        console.log('LEAVING APPLICATIONS');
        console.log(nextState, transition);
      }
      }, [
        h(Router.DefaultRoute, {
          name: 'applications-index',
          handler: ApplicationIndex
        }),
        h(Router.Route, {
          name: 'applicationPage',
          path: ':id',
          handler: ApplicationPage
        }, [
          h(Router.Route, {
            name: 'applicationEditor',
            path: 'edit',
            handler: ApplicationEditor
          })
      ]),
    ])
  ])
);

Router.run(routes, Router.HashLocation, function (Handler) {
  React.render(h(Handler), window.document.getElementById('tool-content'));
});
