'use strict';

var h = require('react-hyperscript');
var React = require('react');
var Router = require('react-router');

var SessionActions = require('../actions/session.actions');
var SessionStore = require('../stores/session.store');

var Navigation = React.createClass({

  displayName: 'Navigation',

  mixins: [Router.State],

  getInitialState: function getInitialState() {
    return {
      currentUser: null,
      userDropdownExpanded: false
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

  _onToggleDropdown: function _onToggleDropdown(event) {
    event.preventDefault();
    this.setState({
      userDropdownExpanded: !this.state.userDropdownExpanded
    });
  },

  render: function render() {
    var currentUser = this.state.currentUser;
    var nav;
    var userDropdown;

    if (currentUser) {
      var username = currentUser.firstName + ' ' + currentUser.lastName;
      nav = h('ul', {className: 'nav navbar-nav'}, [
        h('li', [
          h(Router.Link, {to: 'applications'}, 'Applications')
        ])
      ]);
      userDropdown = h('ul', {className: 'nav navbar-nav navbar-right'}, [
        h('li', {className: 'dropdown'}, [
          h('a', {
            href: '#',
            className: 'dropdown-toggle',
            'data-toggle': 'dropdown',
            role: 'button',
            'aria-haspopup': true,
            'aria-expanded': false,
            onClick: this._onToggleDropdown
          }, [
            h('span', 'Signed in as ' + username),
            h('span', {className: 'caret'})
          ]),
          h('ul', {className: 'dropdown-menu', style: {
            'display': this.state.userDropdownExpanded ? 'block' : 'none'
          }}, [
            h('li', [
              h('a', {onClick: this._onLogout, href: ''}, 'Logout')
            ])
          ])
        ])
      ]);
    } else {
      userDropdown = h('ul', {className: 'nav navbar-nav navbar-right'}, [
        h('li', [
          h(Router.Link, {to: 'login'}, 'Login')
        ])
      ]);
    }

    return(
      h('nav', {className: 'navbar navbar-default navbar-fixed-top'}, [
        h('div', {className: 'container-fluid'}, [
          h('div', {className: 'navbar-header'}, [
            h('button', {
              type: 'button',
              className: 'navbar-toggle collapsed',
              'data-toggle': 'collapse',
              'data-target': '#hackathon-internal-navbar',
              'aria-expanded': false
            }, [
              h('span', {className: 'sr-only'}, 'Toggle navigation'),
              h('span', {className: 'icon-bar'}),
              h('span', {className: 'icon-bar'}),
              h('span', {className: 'icon-bar'})
            ]),
            h(Router.Link, {to: 'dashboard', className: 'navbar-brand'}, 'hackathon-internal')
          ]),
          h('div', {className: 'collapse navbar-collapse', id: 'hackathon-internal-navbar'}, [
            nav,
            userDropdown
          ])
        ])
      ])
    );
  }

});

module.exports = Navigation;
