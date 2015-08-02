'use strict';

var h = require('react-hyperscript');
var React = require('react');
var Router = require('react-router');

// Flux
var ApplicationStore = require('../../stores/application.store');
var SessionStore = require('../../stores/session.store');

function _getCurrentHackathon() {
  var hackathon = SessionStore.getCurrentHackathon();

  return hackathon;
}

var ApplicationHandler = React.createClass({

  displayName: 'ApplicationHandler',

  mixins: [Router.State, Router.Navigation],

  getInitialState: function getInitialState() {
    return {
      tabs: []
    };
  },

  componentWillMount: function componentWillMount() {
    var hackathon = _getCurrentHackathon();
    var tabs = this._setTabs(hackathon);

    this.setState({
      currentHackathon: _getCurrentHackathon(),
      tabs: tabs
    });
  },

  componentDidMount: function componentDidMount() {
    ApplicationStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function componentWillUnmount() {
    ApplicationStore.removeChangeListener(this._onChange);
  },

  _onChange: function _onChange() {
    var hackathon = _getCurrentHackathon();
    var tabs = this._setTabs(hackathon);

    this.setState({
      currentHackathon: hackathon,
      tabs: tabs
    });
  },

  _onSelection: function _onSelection(event) {
    var target = event.target;

    this.transitionTo(target.getAttribute('data-tab'));
  },

  _setTabs: function _setTabs(hackathon) {
    var isActiveRoute = this.isActive('applications-index', this.props.params, this.props.query);
    var baseIconClass = 'glyphicon _glyphicon';
    var tabs = [{
      name: 'Index',
      iconClass: baseIconClass + ' glyphicon-list',
      routeName: 'applications-index'
    }];
    var hackathonTabs = [{
      name: 'Config',
      iconClass: baseIconClass + ' glyphicon-cog',
      routeName: 'applications-config'
    }];

    if (hackathon) {
      Array.prototype.push.apply(tabs, hackathonTabs);
    } else if (!isActiveRoute) {
      this.transitionTo('applications-index');
    }

    return tabs;
  },

  _getNavTabs: function _getNavTabs() {
    var self = this;

    var tabs = this.state.tabs.map(function(tab, index) {
      var isActiveRoute = self.isActive(tab.routeName, self.props.params, self.props.query);

      return h('li', {
        className: isActiveRoute ? 'active' : '',
        role: 'presentation',
        key: index
      }, [
        h('a', {
          className: 'hi-sudo-link',
          'aria-controls': tab.name.toLowerCase(),
          'data-toggle': 'tab',
          'data-tab': tab.routeName,
          role: 'tab',
          onClick: self._onSelection,
        }, [
          h('span', {className: tab.iconClass}),
          h('span', tab.name)
        ])
      ]);
    });

    return h('ul', {className: 'nav nav-tabs', role: 'tablist'}, [
      tabs
    ]);
  },

  render: function render() {
    var tabs = this._getNavTabs();

    return (
      h('div', {className: 'container'}, [
        h('div', {className: 'row'}, [
          h('section', {className: 'col-md-12'}, [
            h('div', {className: 'page__header'}, [
              h('h2', {className: 'page__title title--inline'}, this.state.currentHackathon.season || 'All seasons'),
              h('h4', {className: 'page__title title--inline text-muted'}, '/'),
              h('h4', {className: 'title--inline'}, 'Applications')
            ])
          ]),
          h('section', {className: 'col-md-12'}, [
            h('div', {className: 'page__body'}, [
              tabs,
              h('div', {className: 'tab__content'}, [
                h(Router.RouteHandler)
              ])
            ])
          ])
        ])
      ])
    );
  }

});

module.exports = ApplicationHandler;
