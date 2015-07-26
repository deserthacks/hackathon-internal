'use strict';

var h = require('react-hyperscript');
var React = require('react');

var ApplicationStore = require('../../stores/application.store');
var ApplicationReviewModule = require('../application-review.module');

var ApplicationPage = React.createClass({

  getInitialState: function getInitialState() {
    return {};
  },

  componentDidMount: function componentDidMount() {
    this._onChange();
  },

  componentWillMount: function componentDidMount() {
    ApplicationStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function componentWillUnmount() {
    ApplicationStore.removeChangeListener(this._onChange);
  },

  _onChange: function _onChange() {
    var params = this.props.params;
    var application = ApplicationStore.getApplication(params.id);

    this.setState({
      application: application
    });
  },

  render: function render() {
    var application = this.state.application;
    var responses = 0;

    if (application) {
      var Response = application.response.map(function(response) {
        return h('p', {key: responses++}, response);
      });

      return (
        h('div', {className: 'row'}, [
          h('div', {className: 'col-md-2'}, [
            h('div', {className: 'page__sidebar'}, [
              h(ApplicationReviewModule, {
                application: application
              })
            ])
          ]),
          h('div', {className: 'col-md-10'}, [
            h('div', {className: 'page__header'}, [
              h('h4', 'Status: ' + application.status)
            ]),
            h('div', {className: 'page__content'}, [
              h('h5', 'Response'),
              Response
            ])
          ])
        ])
      );
    }

    return (
      h('div', {className: 'row'}, [
        h('div', {className: 'col-md-12'}, [
          h('div', {className: 'page__header'}, [
            h('h4', 'Application status...')
          ]),
          h('div', {className: 'page__content'}, [
            h('h5', 'Response'),
            h('p', 'Application response...')
          ]),
          h('h3', 'application page')
        ])
      ])
    );

  }

});

module.exports = ApplicationPage;
