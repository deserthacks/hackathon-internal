'use strict';

var h = require('react-hyperscript');
var React = require('react');
var Router = require('react-router');

var ApplicationStore = require('../../stores/application.store');

function getApplicationStats() {
  var stats = ApplicationStore.getStats();

  return stats;
}

var Dashboard = React.createClass({

  displayName: 'Dashboard',

  mixins: [Router.State, Router.Navigation],

  getInitialState: function getInitialState() {
    return {
      applicationStats: {}
    };
  },

  componentDidMount: function componentDidMount() {
    this.setState({
      applicationStats: getApplicationStats()
    });
  },

  render: function render() {
    return (
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
    );
  }

});

module.exports = Dashboard;
