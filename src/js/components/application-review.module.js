'use strict';

var h = require('react-hyperscript');
var React = require('react');

var ApplicationActions = require('../actions/application.actions');

var ApplicationReviewModule = React.createClass({

  displayName: 'ApplicationReviewModule',

  propTypes: {
    application: React.PropTypes.object.isRequired
  },

  getInitialState: function getInitialState() {
    return {};
  },

  _onAccept: function _onAccept() {
    ApplicationActions.acceptApplication(this.props.application);
  },

  _onReject: function _onReject() {
    ApplicationActions.rejectApplication(this.props.application);
  },

  render: function render() {
    var application = this.props.application;

    return (
      h('div', {className: 'module__container'}, [
        h('div', {className: 'module__content'}, [
          h('h5', 'Decision: ' + (application.accepted ? 'Accepted' : 'Rejected')),
          h('ul', {className: 'list-inline'}, [
            h('li', [
              h('button', {className: 'btn btn-success', onClick: this._onAccept}, 'Accept')
            ]),
            h('li', [
              h('button', {className: 'btn btn-danger', onClick: this._onReject}, 'Reject')
            ])
          ])
        ])
      ])
    );

  }

});

module.exports = ApplicationReviewModule;
