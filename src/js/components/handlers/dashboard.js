const h = require('react-hyperscript');
const React = require('react');
const Router = require('react-router');

const ApplicationStore = require('../../stores/application.store');
const SessionStore = require('../../stores/session.store');

const tabContent = {
  APPLICATIONS: 'Applications',
};

function getApplicationStats() {
  const stats = ApplicationStore.getStats();

  return stats;
}

function getCurrentHackathon() {
  const hackathon = SessionStore.getCurrentHackathon();

  return hackathon;
}

const DashboardHome = React.createClass({

  displayName: 'DashboardHome',

  getInitialState: function getInitialState() {
    return {};
  },

  render: function render() {
    return (
      h('div', { className: 'row' }, [
        h('div', { className: 'col-md-4' }, [
          h('div', { className: 'panel panel-default' }, [
            h('div', { className: 'panel-heading' }, [
              h('h3', { className: 'panel-title' }, 'Applications'),
            ]),
            h('div', { className: 'panel-body' }, [
              h('p', 'Eventual (realtime?) stats here i.e. received/reviewed, etc'),
            ]),
          ]),
        ]),
        h('div', { className: 'col-md-4' }, [
          h('div', { className: 'panel panel-default' }, [
            h('div', { className: 'panel-heading' }, [
              h('h3', { className: 'panel-title' }, 'Metrics'),
            ]),
            h('div', { className: 'panel-body' }, [
              h('p', 'Graphs'),
            ]),
          ]),
        ]),
        h('div', { className: 'col-md-4' }, [
          h('div', { className: 'panel panel-default' }, [
            h('div', { className: 'panel-heading' }, [
              h('h3', { className: 'panel-title' }, 'Help/mentor tickets'),
            ]),
            h('div', { className: 'panel-body' }, [
              h('p', 'List of current help tickets'),
            ]),
          ]),
        ]),
      ])
    );
  },

});

const Dashboard = React.createClass({

  displayName: 'Dashboard',

  mixins: [Router.State, Router.Navigation],

  getInitialState: function getInitialState() {
    return {
      activeTab: 0,
      applicationStats: {},
    };
  },

  componentWillMount: function componentWillMount() {
    const hackathon = getCurrentHackathon();
    const tabs = this.setTabs(hackathon);

    this.setState({
      currentHackathon: getCurrentHackathon(),
      tabs,
    });
  },

  componentDidMount: function componentDidMount() {
    this.setState({
      applicationStats: getApplicationStats(),
    });

    SessionStore.addChangeListener(this.onChange);
  },

  componentWillUnmount: function componentWillUnmount() {
    SessionStore.removeChangeListener(this.onChange);
  },

  onChange: function onChange() {
    const hackathon = getCurrentHackathon();
    const tabs = this.setTabs(hackathon);

    this.setState({
      currentHackathon: hackathon,
      tabs,
    });
  },

  onSelection: function onSelection(event) {
    const target = event.target;

    console.log(target.getAttribute('data-tab'));

    this.setState({
      activeTab: Number(target.getAttribute('data-tab')),
    });
  },

  setTabs: function setTabs(hackathon) {
    const tabs = [{
      name: 'Dashboard',
    }];
    const hackathonTabs = [{
      name: 'Applications',
    }, {
      name: 'Emails',
    }, {
      name: 'Announcements',
    }, {
      name: 'Mentors',
    }];

    if (hackathon) {
      Array.prototype.push.apply(tabs, hackathonTabs);
    }

    return tabs;
  },

  getNavTabs: function getNavTabs() {
    const self = this;
    const activeTab = this.state.activeTab;

    const tabs = this.state.tabs.map((tab, index) => (
      h('li', {
        className: index === activeTab ? 'active' : '',
        role: 'presentation',
      }, [
        h('a', {
          className: 'hi-sudo-link',
          'aria-controls': tab.name.toLowerCase(),
          'data-toggle': 'tab',
          'data-tab': index,
          role: 'tab',
          onClick: self.onSelection,
        }, tab.name),
      ])
    ));

    return h('ul', { className: 'nav nav-tabs', role: 'tablist' }, [
      tabs,
    ]);
  },

  getContentTabs: function getContentTabs() {
    const activeTab = this.state.activeTab;
    const tabClassname = 'tab-pane _tab-panel';

    const tabs = this.state.tabs.map((tab, index) => {
      if (index !== activeTab) {
        return undefined;
      }
      let content;

      switch (tab.name) {
        case tabContent.APPLICATIONS:
          content = h('h5', 'Applications dashboard');
          break;

        default:
          content = h(DashboardHome);
          break;
      }

      return h('div', {
        className: index === activeTab ? `${tabClassname} active` : tabClassname,
        id: tab.name.toLowerCase(),
        role: 'tabpanel',
      }, [
        content,
      ]);
    });

    return tabs;
  },

  render: function render() {
    const hackathon = this.state.currentHackathon;
    const tabs = this.getNavTabs();
    const content = this.getContentTabs();

    if (hackathon) {
      return (
        h('div', { className: 'container' }, [
          h('div', { className: 'row' }, [
            h('section', { className: 'col-md-12' }, [
              h('div', { className: 'page__header' }, [
                h('h1', { className: 'page__title' }, hackathon.season),
              ]),
            ]),
            h('section', { className: 'col-md-12' }, [
              h('div', { className: 'page__body' }, [
                tabs,
                content,
              ]),
            ]),
          ]),
        ])
      );
    }

    return (
      h('div', { className: 'container' }, [
        h('div', { className: 'row' }, [
          h('section', { className: 'col-md-12' }, [
            h('div', { className: 'page__header' }, [
              h('h1', { className: 'page__title' }, 'hackathon-internal'),
              h('p', 'Internal tools for hackathons'),
            ]),
          ]),
          h('section', { className: 'col-md-12' }, [
            h('div', { className: 'page__body' }, [
              h('div', { className: 'row' }, [
                h('div', { className: 'col-md-4' }, [
                  h('h5', 'Applications received'),
                  h('span', this.state.applicationStats.received),
                ]),
                h('div', { className: 'col-md-4' }, [
                  h('h5', 'Applications reviewed'),
                ]),
                h('div', { className: 'col-md-4' }, [
                  h('h5', 'Content'),
                ]),
              ]),
            ]),
          ]),
        ]),
      ])
    );
  },

});

module.exports = Dashboard;
