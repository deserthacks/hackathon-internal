const h = require('react-hyperscript');
const React = require('react');
const Router = require('react-router');

const SessionActions = require('../../actions/session.actions');
const SessionStore = require('../../stores/session.store');

const LoginPage = React.createClass({

  displayName: 'LoginPage',

  mixins: [Router.State, Router.Navigation],

  getInitialState: function getInitialState() {
    return {
      applicationStats: {},
    };
  },

  componentDidMount: function componentDidMount() {
    SessionStore.addChangeListener(this.onChange);

    React.findDOMNode(this.refs.email).focus();
  },

  componentWillUnmount: function componentWillUnmount() {
    SessionStore.removeChangeListener(this.onChange);
  },

  onChange: function onChange() {
    this.setState({
      currentUser: SessionStore.getCurrentUser(),
    });

    if (this.state.currentUser) {
      this.transitionTo('dashboard');
    }
  },

  onFormChange: function onFormChange(event) {
    const target = event.target;
    const state = {};

    state[target.id] = target.value;
    this.setState(state);
  },

  onSubmit: function onSubmit(event) {
    event.preventDefault();
    const request = {
      email: this.state.email,
      password: this.state.password,
    };

    SessionActions.login(request);
  },

  render: function render() {
    return (
      h('div', { className: 'container' }, [
        h('div', { className: 'row' }, [
          h('div', { className: 'col-md-4 col-md-offset-4' }, [
            h('div', { className: 'panel panel-default' }, [
              h('div', { className: 'panel-heading' }, [
                h('h3', { className: 'panel-title' }, 'Tools Login'),
              ]),
              h('div', { className: 'panel-body' }, [
                h('form', [
                  h('div', { className: 'form-group' }, [
                    h('label', { htmlFor: 'email' }, 'Email address'),
                    h('input', {
                      type: 'text',
                      className: 'form-control',
                      id: 'email',
                      ref: 'email',
                      onChange: this.onFormChange,
                    }),
                  ]),
                  h('div', { className: 'form-group' }, [
                    h('label', { htmlFor: 'password' }, 'Password'),
                    h('input', {
                      type: 'password',
                      className: 'form-control',
                      id: 'password',
                      onChange: this.onFormChange,
                    }),
                  ]),
                  h('div', { className: 'form-group' }, [
                    h('button', {
                      className: 'btn btn-default',
                      onClick: this.onSubmit,
                    }, 'Login'),
                  ]),
                ]),
              ]),
            ]),
          ]),
        ]),
      ])
    );
  },

});

module.exports = LoginPage;
