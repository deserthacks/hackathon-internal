'use strict';

var h = require('react-hyperscript');
var React = require('react');
var Router = require('react-router');

var SessionActions = require('../actions/session.actions');
var SessionStore = require('../stores/session.store');

var Navigation = React.createClass({

  getInitialState: function getInitialState() {
    return {
      currentUser: null
    };
  },

  componentWillMount: function componentDidMount() {
    SessionStore.addChangeListener(this._onChange);
    this.setState({
      currentUser: SessionStore.getCurrentUser()
    });
  },

  componentWillUnmount: function componentWillUnmount() {
    SessionStore.removeChangeListener(this._onChange);
  },

  _onChange: function _onChange() {
    this.setState({
      currentUser: SessionStore.getCurrentUser()
    });
  },

  _onLogout: function _onLogout() {
    SessionActions.logout();
  },

  render: function render() {
    var currentUser = this.state.currentUser;
    var activeNav;

    console.log('current user: %O', currentUser);

    if (currentUser) {
      activeNav = h('li', {}, [
        h('span', 'Logged in as: ' + currentUser.firstName),
        h('a', {onClick: this._onLogout, href: ''}, 'Logout')
      ]);
    } else {
      activeNav = h('li', {}, [
        h(Router.Link, {to: 'login'}, 'Login')
      ]);
    }

    return(
      h('div', {className: 'row'}, [
        h('div', {className: 'col-md-12'}, [
          h('ul', {className: 'list-inline'}, [
            h('li', [
              h(Router.Link, {to: 'dashboard'}, 'Dashboard')
            ]),
            h('li', [
              h(Router.Link, {to: 'applications'}, 'Applications')
            ]),
            activeNav
          ])
        ])
      ])
    );
  }

});

module.exports = Navigation;
