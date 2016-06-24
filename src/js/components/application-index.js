const h = require('react-hyperscript');
const React = require('react');
const Router = require('react-router');

// Flux
const ApplicationActions = require('../actions/application.actions');
const ApplicationStore = require('../stores/application.store');
const SessionStore = require('../stores/session.store');

// Components
const ApplicationTable = require('./application-table');

function getApplications() {
  return ApplicationStore.getApplications();
}

function getCurrentHackathon() {
  const hackathon = SessionStore.getCurrentHackathon();

  return hackathon;
}

const ApplicationIndex = React.createClass({
  displayName: 'ApplicationIndex',

  mixins: [Router.State, Router.Navigation],

  getInitialState: function getInitialState() {
    return {
      applicationStats: {},
      applications: [],
      sortedApplications: [],
      filterBy: null,
    };
  },

  componentWillMount: function componentWillMount() {
    const hackathon = getCurrentHackathon();

    this.setState({
      currentHackathon: hackathon,
    });

    this.filterRowsBy(this.state.filterBy);
  },

  componentDidMount: function componentDidMount() {
    ApplicationActions.getApplications();
    ApplicationStore.addChangeListener(this.onChange);
  },

  componentWillUnmount: function componentWillUnmount() {
    ApplicationStore.removeChangeListener(this.onChange);
  },

  onChange: function onChange() {
    const hackathon = getCurrentHackathon();

    this.setState({
      applications: getApplications(),
      currentHackathon: hackathon,
    });

    this.filterRowsBy(this.state.filterBy);
  },

  onClick: function onClick(event) {
    if (event) {
      this.transitionTo('applicationPage', { id: event._id });
    }
  },

  onFilterChange: function onFilterChange(event) {
    this.filterRowsBy(event.target.value);
  },

  filterRowsBy: function filterRowsBy(filterBy) {
    const applications = this.state.applications.slice();
    let sortedApplications;

    if (filterBy) {
      sortedApplications = applications.filter((row) => (
        row.name.toLowerCase().indexOf(filterBy.toLowerCase()) >= 0
      ));
    } else {
      sortedApplications = applications;
    }

    this.setState({
      sortedApplications,
      filterBy,
    });
  },

  render: function render() {
    return (
      h('div', { className: 'row' }, [
        h('section', { className: 'col-md-12' }, [
          h('div', { className: 'page__body' }, [
            h(ApplicationTable, {
              applications: this.state.sortedApplications,
              initialLength: this.state.applications.length,
              filter: '',
              onClick: this.onClick,
            }),
          ]),
        ]),
      ])
    );
  },

});


module.exports = ApplicationIndex;
