'use strict';

var classnames = require('classnames');
var h = require('react-hyperscript');
var moment = require('moment');
var React = require('react');
var Router = require('react-router');

var ApplicationActions = require('../actions/application.actions');

var ApplicationReviewModule = React.createClass({

  displayName: 'ApplicationReviewModule',

  propTypes: {
    application: React.PropTypes.object.isRequired
  },

  getInitialState: function getInitialState() {
    return {
      reviewNote: ''
    };
  },

  componentWillMount: function componentWillMount() {
    if (window.addEventListener) {
      window.addEventListener('keydown', this._onKeyEvent, true);
    } else if (window.attachEvent) {
      window.attachEvent('keydown', this._onKeyEvent);
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    if (window.removeEventListener) {
      window.removeEventListener('keydown', this._onKeyEvent, true);
    } else if (window.detachEvent) {
      window.detachEvent('keydown', this._onKeyEvent);
    }
  },

  _onKeyEvent: function _onKeyEvent(event) {
    if (event.target.localName === 'body') {
      switch (event.keyCode) {
        case 65:
          this._onAccept(event);
          break;

        case 82:
          this._onReject(event);
          break;
      }
    }
  },

  _onAccept: function _onAccept() {
    var application = this.props.application;

    application.reviewNote = this.state.reviewNote;
    ApplicationActions.acceptApplication(application);

    this.setState({
      reviewNote: ''
    });
  },

  _onReject: function _onReject() {
    var application = this.props.application;

    application.reviewNote = this.state.reviewNote;
    ApplicationActions.rejectApplication(application);

    this.setState({
      reviewNote: ''
    });
  },

  _onFormChange: function _onFormChange(event) {
    var target = event.target;

    this.setState({
      reviewNote: target.value
    });
  },

  render: function render() {
    var application = this.props.application;
    var reviewerLink;
    var reviewNote;

    var panelClassname = classnames({
      'module__content': true,
      'panel': true,
      'panel-success': application.accepted,
      'panel-danger': (!application.accepted && application.status === 'reviewed'),
      'panel-warning': (!application.accepted && application.status === 'received')
    });
    var acceptButtonClassname = classnames({
      'btn btn-success': true,
      'active': (application.accepted && application.status === 'reviewed')
    });
    var rejectButtonClassname = classnames({
      'btn btn-danger': true,
      'active': (!application.accepted && application.status === 'reviewed')
    });

    if (application.reviewedBy) {
      reviewerLink = h(Router.Link, {to: 'dashboard', params: {id: application.reviewedBy._id}}, application.reviewedBy.firstName + ' ' + application.reviewedBy.lastName);
    } else {
      reviewerLink = h('em', 'No reviewer');
    }

    if (application.reviewNote) {
      reviewNote =  h('p', application.reviewNote);
    } else {
      reviewNote = h('em', 'No note');
    }

    return (
      h('div', {className: 'module__container'}, [
        h('div', {className: panelClassname}, [
          h('div', {className: 'panel-heading'}, [
            h('h3', {className: 'panel-title'}, application.accepted ? 'Accepted' : 'Rejected'),
            h('em', {className: 'pull-right'}, application.status === 'received' ? 'Pending' : 'Decided')
          ]),
          h('div', {className: 'panel-body'}, [
            h('div', [
              h('h5', 'Reviewer:'),
              reviewerLink
            ]),
            h('div', [
              h('h5', 'Reviewer note:'),
              reviewNote,
            ])
          ]),
          h('ul', {className: 'list-group'}, [
            h('li', {
              className: 'list-group-item',
              title: moment(application.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a')
            }, [
              h('strong', 'Received '),
              h('span', moment(application.createdAt).fromNow())
            ]),
            h('li', {
              className: 'list-group-item',
              title: moment(application.reviewedAt).format('dddd, MMMM Do YYYY, h:mm:ss a')
            }, [
              h('strong', 'Reviewed '),
              h('span', moment(application.reviewedAt).fromNow())
            ]),
            h('li', {className: 'list-group-item'}, [
              h('form', [
                h('div', {className: 'form-group'}, [
                  h('label', {htmlFor: 'reviewNote'}, 'Update'),
                  h('textarea', {className: 'form-control', id: 'reviewNote', placeholder: 'Optional', onChange: this._onFormChange, value: this.state.reviewNote})
                ]),
                h('div', {className: 'form-group'}, [
                  h('ul', {className: 'list-inline'}, [
                    h('li', [
                      h('button', {className: acceptButtonClassname, onClick: this._onAccept}, [
                        h('span', {className: 'glyphicon glyphicon-ok-circle'}),
                        h('span', ' Accept')
                      ])
                    ]),
                    h('li', [
                      h('button', {className: rejectButtonClassname, onClick: this._onReject}, [
                        h('span', {className: 'glyphicon glyphicon-remove-circle'}),
                        h('span', ' Reject')
                      ])
                    ])
                  ])
                ])
              ])
            ])
          ])
        ])
      ])
    );

  }

});

module.exports = ApplicationReviewModule;
