const h = require('react-hyperscript');
const React = require('react');
const Router = require('react-router');

// Flux
const ApplicationStore = require('../../stores/application.store');
const SessionStore = require('../../stores/session.store');


function getCurrentHackathon() {
  const hackathon = SessionStore.getCurrentHackathon();

  return hackathon;
}


const ApplicationHandler = React.createClass({

  displayName: 'ApplicationHandler',

  mixins: [Router.State, Router.Navigation],

  getInitialState: function getInitialState() {
    return {
      tabs: [],
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
    ApplicationStore.addChangeListener(this.onChange);
  },

  componentWillUnmount: function componentWillUnmount() {
    ApplicationStore.removeChangeListener(this.onChange);
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

    this.transitionTo(target.getAttribute('data-tab'));
  },

  setTabs: function setTabs(hackathon) {
    const isActiveRoute = this.isActive('applications-index', this.props.params, this.props.query);
    const baseIconClass = 'glyphicon _glyphicon';
    const tabs = [{
      name: 'Index',
      iconClass: `${baseIconClass} glyphicon-list`,
      routeName: 'applications-index',
    }];
    const hackathonTabs = [{
      name: 'Config',
      iconClass: `${baseIconClass} glyphicon-cog`,
      routeName: 'applications-config',
    }];

    if (hackathon) {
      Array.prototype.push.apply(tabs, hackathonTabs);
    } else if (!isActiveRoute) {
      this.transitionTo('applications-index');
    }

    return tabs;
  },

  getNavTabs: function getNavTabs() {
    const self = this;

    const tabs = this.state.tabs.map((tab, index) => {
      const isActiveRoute = self.isActive(tab.routeName, self.props.params, self.props.query);

      return h('li', {
        className: isActiveRoute ? 'active' : '',
        role: 'presentation',
        key: index,
      }, [
        h('a', {
          className: 'hi-sudo-link',
          'aria-controls': tab.name.toLowerCase(),
          'data-toggle': 'tab',
          'data-tab': tab.routeName,
          role: 'tab',
          onClick: self.onSelection,
        }, [
          h('span', { className: tab.iconClass }),
          h('span', tab.name),
        ]),
      ]);
    });

    return h('ul', { className: 'nav nav-tabs', role: 'tablist' }, [
      tabs,
    ]);
  },

  render: function render() {
    const tabs = this.getNavTabs();

    return (
      h('div', { className: 'container' }, [
        h('div', { className: 'row' }, [
          h('section', { className: 'col-md-12' }, [
            h('div', { className: 'page__header' }, [
              h('h2', {
                className: 'page__title title--inline',
              }, this.state.currentHackathon.season || 'All seasons'),
              h('h4', { className: 'page__title title--inline text-muted' }, '/'),
              h('h4', { className: 'title--inline' }, 'Applications'),
            ]),
          ]),
          h('section', { className: 'col-md-12' }, [
            h('div', { className: 'page__body' }, [
              tabs,
              h('div', { className: 'tab__content' }, [
                h(Router.RouteHandler),
              ]),
            ]),
          ]),
        ]),
      ])
    );
  },

});


module.exports = ApplicationHandler;
