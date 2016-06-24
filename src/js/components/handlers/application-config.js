const h = require('react-hyperscript');
const moment = require('moment');
const React = require('react');
const Router = require('react-router');

const ApplicationAPI = require('../../apis/application.api');

/**
 * Application config page. User can edit
 * attributes of an application.
 */
const ApplicationConfig = React.createClass({

  displayName: 'ApplicationConfig',

  mixins: [Router.Navigation, Router.State],

  getInitialState: function getInitialState() {
    return {
      configs: [],
    };
  },

  componentDidMount: function componentDidMount() {
    const self = this;
    const isActiveRoute = this.isActive(
      'applications-config-page',
      this.props.params,
      this.props.query
    );
    const options = {};

    if (!isActiveRoute) {
      ApplicationAPI.getApplicationConfigs(options, (err, configs) => {
        if (err) {
          // TODO: handle err
        }
        self.setState({
          configs,
        });
      });
    }
  },

  onSelection: function onSelection(event) {
    const target = event.target;

    if (target.id) {
      this.transitionTo('application-config-page', { id: target.id });
    }
  },

  getConfigs: function getConfigs() {
    const self = this;
    const configs = this.state.configs;

    const configPanels = configs.map((config) => (
      h('div', { className: 'col-md-6' }, [
        h('div', { className: 'panel panel-default' }, [
          h('div', { className: 'panel-heading' }, [
            h('h3', { className: 'panel-title _panel-title' }, 'Role: '),
            h('span', config.role),
            h('button', {
              className: 'btn btn-link pull-right',
              onClick: self.onSelection,
              id: config._id,
            }, 'Edit'),
          ]),
          h('div', { className: 'panel-body' }, [
            h('ul', { className: 'list-unstyled' }, [
              h('li', [
                h('strong', 'Open: '),
                h('span', moment(config.open_at).format('lll')),
              ]),
              h('li', [
                h('strong', 'Close: '),
                h('span', moment(config.close_at).format('lll')),
              ]),
              h('li', [
                h('strong', 'Decision: '),
                h('span', moment(config.decision_at).format('lll')),
              ]),
            ]),
          ]),
        ]),
      ])
    ));

    return h('div', [
      configPanels,
    ]);
  },

  getConfigConent: function getConfigConent() {
    const isActiveRoute = this.isActive('application-config-page', this.props.params, this.props.query);
    let content;

    if (!isActiveRoute) {
      content = this.getConfigs();
    } else {
      content = h(Router.RouteHandler);
    }

    return content;
  },

  render: function render() {
    const content = this.getConfigConent();

    return (
      h('div', { className: 'row' }, [
        h('div', { className: 'col-md-12' }, [
          content,
        ]),
      ])
    );
  },

});

module.exports = ApplicationConfig;
