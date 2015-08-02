'use strict';

var h = require('react-hyperscript');
var moment = require('moment');
var React = require('react');
var Router = require('react-router');

var ApplicationAPI = require('../../apis/application.api');

/**
 * Application config page. User can edit
 * attributes of an application.
 */
var ApplicationConfig = React.createClass({

  displayName: 'ApplicationConfig',

  mixins: [Router.Navigation, Router.State],

  getInitialState: function getInitialState() {
    return {
      configs: []
    };
  },

  componentDidMount: function componentDidMount() {
    var self = this;
    var isActiveRoute = this.isActive('applications-config-page', this.props.params, this.props.query);
    var options = {};

    if (!isActiveRoute) {
      ApplicationAPI.getApplicationConfigs(options, function setConfigs(err, configs) {
        if (err) {
          // TODO: handle err
        }
        self.setState({
          configs: configs
        });
      });
    }
  },

  _onSelection: function _onSelection(event) {
    var target = event.target;

    if (target.id) {
      this.transitionTo('application-config-page', {id: target.id});
    }
  },

  _getConfigs: function _getConfigs() {
    var self = this;
    var configs = this.state.configs;

    var configPanels = configs.map(function(config) {
      return h('div', {className: 'col-md-6'}, [
        h('div', {className: 'panel panel-default'}, [
          h('div', {className: 'panel-heading'}, [
            h('h3', {className: 'panel-title _panel-title'}, 'Role: '),
            h('span', config.role),
            h('button', {
              className: 'btn btn-link pull-right',
              onClick: self._onSelection,
              id: config._id
            }, 'Edit')
          ]),
          h('div', {className: 'panel-body'}, [
            h('ul', {className: 'list-unstyled'}, [
              h('li', [
                h('strong', 'Open: '),
                h('span', moment(config.open_at).format('lll'))
              ]),
              h('li', [
                h('strong', 'Close: '),
                h('span', moment(config.close_at).format('lll'))
              ]),
              h('li', [
                h('strong', 'Decision: '),
                h('span', moment(config.decision_at).format('lll'))
              ])
            ])
          ])
        ])
      ]);
    });

    return h('div', [
      configPanels
    ]);
  },

  _getConfigConent: function _getConfigConent() {
    var isActiveRoute = this.isActive('application-config-page', this.props.params, this.props.query);
    var content;

    if (!isActiveRoute) {
      content = this._getConfigs();
    } else {
      content = h(Router.RouteHandler);
    }

    return content;
  },

  render: function render() {
    var content = this._getConfigConent();

    return (
      h('div', {className: 'row'}, [
        h('div', {className: 'col-md-12'}, [
          content
        ])
      ])
    );
  }

});

module.exports = ApplicationConfig;
