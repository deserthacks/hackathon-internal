'use strict';

var h = require('react-hyperscript');
var React = require('react');
var Router = require('react-router');

var ApplicationStore = require('../../stores/application.store');
var SessionStore = require('../../stores/session.store');

var tabContent = {
  APPLICATIONS: 'Applications'
};

function getApplicationStats() {
  var stats = ApplicationStore.getStats();

  return stats;
}

function getCurrentHackathon() {
  var hackathon = SessionStore.getCurrentHackathon();

  return hackathon;
}

var DashboardHome = React.createClass({

  displayName: 'DashboardHome',

  getInitialState: function getInitialState() {
    return {};
  },

  render: function render() {
    return (
      h('div', {className: 'row'}, [
        h('div', {className: 'col-md-4'}, [
          h('div', {className: 'panel panel-default'}, [
            h('div', {className: 'panel-heading'}, [
              h('h3', {className: 'panel-title'}, 'Applications')
            ]),
            h('div', {className: 'panel-body'}, [
              h('p', 'Eventual (realtime?) stats here i.e. received/reviewed, etc')
            ])
          ])
        ]),
        h('div', {className: 'col-md-4'}, [
          h('div', {className: 'panel panel-default'}, [
            h('div', {className: 'panel-heading'}, [
              h('h3', {className: 'panel-title'}, 'Metrics')
            ]),
            h('div', {className: 'panel-body'}, [
              h('p', 'Graphs')
            ])
          ])
        ]),
        h('div', {className: 'col-md-4'}, [
          h('div', {className: 'panel panel-default'}, [
            h('div', {className: 'panel-heading'}, [
              h('h3', {className: 'panel-title'}, 'Help/mentor tickets')
            ]),
            h('div', {className: 'panel-body'}, [
              h('p', 'List of current help tickets')
            ])
          ])
        ])
      ])
    );
  }

});

var Dashboard = React.createClass({

  displayName: 'Dashboard',

  mixins: [Router.State, Router.Navigation],

  getInitialState: function getInitialState() {
    return {
      activeTab: 0,
      applicationStats: {}
    };
  },

  componentWillMount: function componentWillMount() {
    var hackathon = getCurrentHackathon();
    var tabs = this._setTabs(hackathon);

    this.setState({
      currentHackathon: getCurrentHackathon(),
      tabs: tabs
    });
  },

  componentWillUnmount: function componentWillUnmount() {
    SessionStore.removeChangeListener(this._onChange);
  },

  componentDidMount: function componentDidMount() {
    this.setState({
      applicationStats: getApplicationStats()
    });

    SessionStore.addChangeListener(this._onChange);
  },

  _onChange: function _onChange() {
    var hackathon = getCurrentHackathon();
    var tabs = this._setTabs(hackathon);

    this.setState({
      currentHackathon: hackathon,
      tabs: tabs
    });
  },

  _onSelection: function _onSelection(event) {
    var target = event.target;

    console.log(target.getAttribute('data-tab'));

    this.setState({
      activeTab: Number(target.getAttribute('data-tab'))
    });
  },

  _setTabs: function _setTabs(hackathon) {
    var tabs = [{
      name: 'Dashboard'
    }];
    var hackathonTabs = [{
      name: 'Applications'
    }, {
      name: 'Emails'
    }, {
      name: 'Announcements'
    }, {
      name: 'Mentors'
    }];

    if (hackathon) {
      Array.prototype.push.apply(tabs, hackathonTabs);
    }

    return tabs;
  },

  _getNavTabs: function _getNavTabs() {
    var self = this;
    var activeTab = this.state.activeTab;

    var tabs = this.state.tabs.map(function(tab, index) {
      return h('li', {
        className: index === activeTab ? 'active' : '',
        role: 'presentation'
      }, [
        h('a', {
          className: 'hi-sudo-link',
          'aria-controls': tab.name.toLowerCase(),
          'data-toggle': 'tab',
          'data-tab': index,
          role: 'tab',
          onClick: self._onSelection,
        }, tab.name)
      ]);
    });

    return h('ul', {className: 'nav nav-tabs', role: 'tablist'}, [
      tabs
    ]);
  },

  _getContentTabs: function _getContentTabs() {
    var activeTab = this.state.activeTab;
    var tabClassname = 'tab-pane _tab-panel';

    var tabs = this.state.tabs.map(function mapContentTabs(tab, index) {
      if (index !== activeTab) {
        return;
      }
      var content;

      switch (tab.name) {
        case tabContent.APPLICATIONS:
          content = h('h5', 'Applications dashboard');
          break;

        default:
          content = h(DashboardHome);
          break;
      }

      return h('div', {
        className: index === activeTab ? tabClassname + ' active' : tabClassname,
        id: tab.name.toLowerCase(),
        role: 'tabpanel'
      }, [
        content
      ]);
    });

    return tabs;
  },

  render: function render() {
    var hackathon = this.state.currentHackathon;
    var tabs = this._getNavTabs();
    var content = this._getContentTabs();

    if (hackathon) {
      return (
        h('div', {className: 'container'}, [
          h('div', {className: 'row'}, [
            h('section', {className: 'col-md-12'}, [
              h('div', {className: 'page__header'}, [
                h('h1', {className: 'page__title'}, hackathon.season)
              ])
            ]),
            h('section', {className: 'col-md-12'}, [
              h('div', {className: 'page__body'}, [
                tabs,
                content
              ])
            ])
          ])
        ])
      );
    } else {
      return (
        h('div', {className: 'container'}, [
          h('div', {className: 'row'}, [
            h('section', {className: 'col-md-12'}, [
              h('div', {className: 'page__header'}, [
                h('h1', {className: 'page__title'}, 'hackathon-internal'),
                h('p', 'Internal tools for hackathons')
              ])
            ]),
            h('section', {className: 'col-md-12'}, [
              h('div', {className: 'page__body'}, [
                h('div', {className: 'row'}, [
                  h('div', {className: 'col-md-4'}, [
                    h('h5', 'Applications received'),
                    h('span', this.state.applicationStats.received)
                  ]),
                  h('div', {className: 'col-md-4'}, [
                    h('h5', 'Applications reviewed')
                  ]),
                  h('div', {className: 'col-md-4'}, [
                    h('h5', 'Content')
                  ])
                ])
              ])
            ])
          ])
        ])
      );
    }

  }

});

module.exports = Dashboard;
