'use strict';

var h = require('react-hyperscript');
var React = require('react');
var Router = require('react-router');

// Flux
var ApplicationActions = require('../actions/application.actions');
var ApplicationStore = require('../stores/application.store');
var SessionStore = require('../stores/session.store');

// Components
var ApplicationTable = require('./application-table');

function _getApplications() {
  return ApplicationStore.getApplications();
}

function _getCurrentHackathon() {
  var hackathon = SessionStore.getCurrentHackathon();

  return hackathon;
}

var ApplicationIndex = React.createClass({

  displayName: 'ApplicationIndex',

  mixins: [Router.State, Router.Navigation],

  getInitialState: function getInitialState() {
    return {
      applicationStats: {},
      applications: [],
      sortedApplications: [],
      filterBy: null
    };
  },

  componentWillMount: function componentWillMount() {
    var hackathon = _getCurrentHackathon();

    this.setState({
      currentHackathon: hackathon
    });

    this._filterRowsBy(this.state.filterBy);
  },

  componentDidMount: function componentDidMount() {
    ApplicationActions.getApplications();
    ApplicationStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function componentWillUnmount() {
    ApplicationStore.removeChangeListener(this._onChange);
  },

  _onClick: function _onClick(event) {
    if (event) {
      this.transitionTo('applicationPage', {id: event._id});
    }
  },

  _onFilterChange: function _onFilterChange(event) {
    this._filterRowsBy(event.target.value);
  },

  _filterRowsBy: function _filterRowsBy(filterBy) {
    var applications = this.state.applications.slice();
    var sortedApplications;

    if (filterBy) {
      sortedApplications = applications.filter(function filter(row) {
        return (row['name'].toLowerCase().indexOf(filterBy.toLowerCase()) >= 0);
      });
    } else {
      sortedApplications = applications;
    }

    this.setState({
      sortedApplications: sortedApplications,
      filterBy: filterBy
    });
  },

  _onChange: function _onChange() {
    var hackathon = _getCurrentHackathon();

    this.setState({
      applications: _getApplications(),
      currentHackathon: hackathon
    });

    this._filterRowsBy(this.state.filterBy);
  },

  render: function render() {
    return (
      h('div', {className: 'row'}, [
        h('section', {className: 'col-md-12'}, [
          h('div', {className: 'page__body'}, [
            h(ApplicationTable, {
              applications: this.state.sortedApplications,
              initialLength: this.state.applications.length,
              filter: '',
              onClick: this._onClick
            })
          ])
        ])
      ])
    );
  }

});

module.exports = ApplicationIndex;
