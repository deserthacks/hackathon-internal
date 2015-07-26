'use strict';

var h = require('react-hyperscript');
var React = require('react');
var Router = require('react-router');

var SessionActions = require('../../actions/session.actions');
var SessionStore = require('../../stores/session.store');

var LoginPage = React.createClass({

  displayName: 'LoginPage',

  mixins: [Router.State, Router.Navigation],

  getInitialState: function getInitialState() {
    return {
      applicationStats: {}
    };
  },

  componentDidMount: function componentDidMount() {
    SessionStore.addChangeListener(this._onChange);

    React.findDOMNode(this.refs.email).focus();
  },

  componentWillUnmount: function componentWillUnmount() {
    SessionStore.removeChangeListener(this._onChange);
  },

  _onChange: function _onChange() {
    this.setState({
      currentUser: SessionStore.getCurrentUser()
    });

    if (this.state.currentUser) {
      this.transitionTo('dashboard');
    }
  },

  _onFormChange: function _onFormChange(event) {
    var target = event.target;
    var state = {};

    state[target.id] = target.value;
    this.setState(state);
  },

  _onSubmit: function _onSubmit(event) {
    event.preventDefault();
    var request = {
      email: this.state.email,
      password: this.state.password
    };

    SessionActions.login(request);
  },

  render: function render() {
    return (
      h('div', {className: 'row'}, [
        h('section', {className: 'col-md-12'}, [
          h('div', {className: 'page__header'}, [
            h('h1', {className: 'page__title'}, 'Tools Login')
          ])
        ]),
        h('section', {className: 'col-md-12'}, [
          h('div', {className: 'page__body'}, [
            h('div', {className: 'row'}, [
              h('div', {className: 'col-md-4'}, [
                h('form', [
                  h('div', {className: 'form-group'}, [
                    h('label', {htmlFor: 'email'}, 'Email address'),
                    h('input', {
                      type: 'text',
                      id: 'email',
                      ref: 'email',
                      onChange: this._onFormChange
                    })
                  ]),
                  h('div', {className: 'form-group'}, [
                    h('label', {htmlFor: 'password'}, 'Password'),
                    h('input', {
                      type: 'password',
                      id: 'password',
                      onChange: this._onFormChange
                    })
                  ]),
                  h('div', {className: 'form-group'}, [
                    h('button', {
                      className: 'btn btn-default',
                      // type: 'submit',
                      onClick: this._onSubmit
                    }, 'Login')
                  ])
                ])
              ])
            ])
          ])
        ])
      ])
    );
  }

});

module.exports = LoginPage;
