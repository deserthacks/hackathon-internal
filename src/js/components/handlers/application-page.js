'use strict';

var h = require('react-hyperscript');
var React = require('react');
var Router = require('react-router');

var ApplicationAPI = require('../../apis/application.api');
var ApplicationStore = require('../../stores/application.store');
var ApplicationReviewModule = require('../application-review.module');

var ApplicationPage = React.createClass({

  getInitialState: function getInitialState() {
    return {};
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this._onChange(nextProps.params);
    this.getAdjacentApplications(nextProps.params);
  },

  componentDidMount: function componentDidMount() {
    this._onChange();
    this.getAdjacentApplications();
  },

  componentWillMount: function componentDidMount() {
    ApplicationStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function componentWillUnmount() {
    ApplicationStore.removeChangeListener(this._onChange);
  },

  getAdjacentApplications: function getAdjacentApplications(params) {
    var self = this;
    params = params || self.props.params;

    console.log(params);

    ApplicationAPI.getAdjacentApplications(params, function(err, res) {
      if (!err && res) {
        self.setState({
          nextApplication: res.next,
          prevApplication: res.previous
        });
      }
    });
  },

  _onChange: function _onChange(params) {
    params = params || this.props.params;
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
      var prevApplication = this.state.prevApplication;
      var nextApplication = this.state.nextApplication;

      var applicationPageNav = function applicationPageNav() {
        var prevLink;
        var nextLink;

        console.log('current: %s', application._id);

        if (prevApplication) {
          console.log('prev: %s', prevApplication._id);
          prevLink = h('div', {className: 'pull-left'}, [
            h('span', {className: 'glyphicon glyphicon-chevron-left'}),
            h(Router.Link, {
              to: 'applicationPage',
              params: {id: prevApplication._id},
              activeClassName: 'disabled text-muted'
            }, 'Previous')
          ]);
        }
        if (nextApplication) {
          console.log('next: %s', nextApplication._id);
          nextLink = h('div', {className: 'pull-right'}, [
            h(Router.Link, {
              to: 'applicationPage',
              params: {id: nextApplication._id},
              activeClassName: 'disabled text-muted'
            }, 'Next'),
            h('span', {className: 'glyphicon glyphicon-chevron-right'})
          ]);
        }

        return h('nav', {className: 'page__nav'}, [
          prevLink,
          nextLink
        ]);
      };

      return (
        h('div', {className: 'container'}, [
          h('div', {className: 'row'}, [
            h('div', {className: 'col-md-12'}, [
              applicationPageNav()
            ])
          ]),
          h('div', {className: 'row'}, [
            h('div', {className: 'col-md-12'}, [
              h('header', {className: 'page__header'}, [
                h('h2', 'Review application')
              ])
            ])
          ]),
          h('div', {className: 'row'}, [
            h('div', {className: 'col-md-3'}, [
              h('div', {className: 'page__sidebar'}, [
                h(ApplicationReviewModule, {
                  application: application
                })
              ])
            ]),
            h('div', {className: 'col-md-9'}, [
              h('div', {className: 'page__content'}, [
                h('h5', 'Response'),
                Response
              ])
            ])
          ])
        ])
      );
    }

    return (
      h('div', {className: 'container'}, [
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
      ])
    );

  }

});

module.exports = ApplicationPage;
