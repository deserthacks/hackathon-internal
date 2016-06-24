const SessionStore = require('../stores/session.store');

const AuthUtil = {

  notAuthenticated: function notAuthenticated(nextState, transition) {
    if (SessionStore.getCurrentUser() === undefined) {
      transition.abort();
    }
  },

  authenticated: function authenticated(nextState, transition) {
    console.log('onEnter handler', nextState, transition);
    if (SessionStore.getCurrentUser() !== undefined) {
      console.warn('User not authenticated for route: ' + transition.path);
      transition.redirect('login', null, { nextPathname: nextState.location.pathname });
    }
  },

  authenticateAs: function authenticateAs(nextState, transition, role) {
    if (SessionStore.getCurrentUser() !== undefined) {
      const currentUserRole = SessionStore.getCurrentUser().role;
      if (currentUserRole !== role) {
        transition.abort();
        transition.redirect('login');
      }
    }
  },
};

module.exports = AuthUtil;
