const React = require('react');
const Router = require('react-router');
const h = require('react-hyperscript');

const App = require('./components/handlers/app');
const ApplicationConfig = require('./components/handlers/application-config');
const ApplicationConfigModule = require('./components/handlers/application-config.module');
const ApplicationEditor = require('./components/handlers/application-editor');
const ApplicationHandler = require('./components/handlers/application-handler');
const ApplicationIndex = require('./components/application-index');
const ApplicationPage = require('./components/handlers/application-page');
const AuthUtil = require('./utils/auth-util');
const Dashboard = require('./components/handlers/dashboard');
const FormEditor = require('./components/handlers/form-editor');
const LoginPage = require('./components/handlers/login-page');

const routes = (
  h(Router.Route, { name: 'root', path: '/', handler: App }, [
    h(Router.DefaultRoute, {
      name: 'dashboard',
      handler: Dashboard,
      onEnter: AuthUtil.authenticated,
    }),
    h(Router.Route, { name: 'login', path: '/login', handler: LoginPage }),
    h(Router.Route, {
      name: 'applications',
      path: '/applications',
      handler: ApplicationHandler,
      onEnter: AuthUtil.authenticated,
    }, [
      h(Router.DefaultRoute, {
        name: 'applications-index',
        handler: ApplicationIndex,
      }),
      h(Router.Route, {
        name: 'applications-config',
        path: 'config',
        handler: ApplicationConfig,
      }, [
        h(Router.Route, {
          name: 'application-config-page',
          path: ':id',
          handler: ApplicationConfigModule,
        }, [
          h(Router.Route, {
            name: 'form-editor',
            path: 'form',
            handler: FormEditor,
          }),
        ]),
      ]),
      h(Router.Route, {
        name: 'applicationPage',
        path: ':id',
        handler: ApplicationPage,
      }, [
        h(Router.Route, {
          name: 'applicationEditor',
          path: 'edit',
          handler: ApplicationEditor,
        }),
      ]),
    ]),
  ])
);

Router.run(routes, Router.HashLocation, (Handler) => {
  React.render(h(Handler), window.document.getElementById('tool-content'));
});
