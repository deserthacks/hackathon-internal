'use strict';

var h = require('react-hyperscript');
var moment = require('moment');
var React = require('react');
var Router = require('react-router');

var ApplicationAPI = require('../../apis/application.api');

function buildForm(application) {
  var form = {};

  if (!application) {
    return;
  }

  form._id = application._id;
  form.open_at = application.open_at.split('.')[0];
  form.close_at = application.close_at.split('.')[0];
  form.decision_at = application.decision_at.split('.')[0];

  return form;
}

/**
 * Application config page. User can edit
 * attributes of an application.
 */
var ApplicationConfig = React.createClass({

  displayName: 'ApplicationConfig',

  mixins: [Router.Navigation, Router.State],

  getInitialState: function getInitialState() {
    return {
      applicationConfig: {},
      configs: [],
      form: {}
    };
  },

  componentDidMount: function componentDidMount() {
    var self = this;
    var params = this.getParams();
    var options = {};

    if (params.id) {
      options.id = params.id;
    }

    ApplicationAPI.getApplicationConfigs(options, function(err, applications) {
      if (err) {

      }

      self.setState({
        form: buildForm(applications[0]),
        applicationConfig: applications[0]
      });
    });
  },

  _onFormChange: function _onFormChange(event) {
    var target = event.target;
    var application = this.state.form;

    application[target.id] = target.value;

    this.setState({
      form: application
    });
  },

  _onFormSubmission: function _onFormSubmission(event) {
    var self = this;
    var request = this.state.form;

    ApplicationAPI.updateApplicationConfig(request, function onUpdate(err, application) {
      if (err) {

      }

      self.setState({
        applicationConfig: application,
        form: buildForm(application)
      });
    });

    event.preventDefault();
  },

  _getContent: function _getContent() {
    var isActiveRoute = this.isActive('form-editor', this.props.params, this.props.query);
    var form = this.state.form;
    var content;

    if (isActiveRoute) {
      content = h(Router.RouteHandler);
    } else {
      content = h('div', {className: 'row'}, [
        h('div', {className: 'col-md-4'}, [
          h('form', [
            h('div', {className: 'form-group'}, [
              h('label', {htmlFor: 'open_at'}, 'Open application submission at:'),
              h('input', {type: 'datetime-local', className: 'form-control', id: 'open_at', value: form.open_at, onChange: this._onFormChange})
            ]),
            h('div', {className: 'form-group'}, [
              h('label', {htmlFor: 'close_at'}, 'Close application submission at:'),
              h('input', {type: 'datetime-local', className: 'form-control', id: 'close_at', value: form.close_at, onChange: this._onFormChange})
            ]),
            h('div', {className: 'form-group'}, [
              h('label', {htmlFor: 'decision_at'}, 'Send application decision emails at:'),
              h('input', {type: 'datetime-local', className: 'form-control', id: 'decision_at', value: form.decision_at, onChange: this._onFormChange})
            ]),
            h('div', {className: 'form-group'}, [
              h('button', {
                className: 'btn btn-success',
                onClick: this._onFormSubmission
              }, 'Update')
            ])
          ])
        ]),
        h('div', {className: 'col-md-8 text-center'}, [
          h('h5', 'Eventual application preview here')
        ])
      ]);
    }

    return content;
  },

  _getNav: function _getNav() {
    var self = this;
    var isActiveRoute = this.isActive('form-editor', this.props.params, this.props.query);
    var nav;

    nav = h('ul', {className: 'nav nav-pills'}, [
      h('li', {
        role: 'presentation',
      }, [
        h('a', {
          href: '',
          onClick: function goBack() {
            self.goBack();
          }
        }, [
          h('span', {className: 'glyphicon _glyphicon glyphicon-chevron-left'}),
          h('span', 'Back')
        ])
      ]),
      h('li', {
        role: 'presentation',
        className: isActiveRoute ? 'pull-right active' : 'pull-right'
      }, [
        h(Router.Link, {to: 'form-editor', params: this.getParams()}, [
          h('span', {className: 'glyphicon _glyphicon glyphicon-edit'}),
          h('span', 'Edit form')
        ])
      ])
    ]);

    return nav;
  },

  render: function render() {
    var applicationConfig = this.state.applicationConfig;
    var content = this._getContent();
    var nav = this._getNav();

    return (
      h('div', {className: 'row'}, [
        h('div', {className: 'col-md-12'}, [
          h('h3', 'Application role: ' + applicationConfig.role),
          nav
        ]),
        h('div', {className: 'col-md-12'}, [
          content
        ])
      ])
    );
  }

});

module.exports = ApplicationConfig;
