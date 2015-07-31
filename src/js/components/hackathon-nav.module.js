'use strict';

var h = require('react-hyperscript');
var React = require('react');
var Router = require('react-router');

var HackathonAPI = require('../apis/hackathon.api');
var SessionActions = require('../actions/session.actions');
var SessionStore = require('../stores/session.store');

var HackathonNavModule = React.createClass({

  displayName: 'HackathonNavModule',

  mixins: [Router.Navigation],

  getInitialState: function getInitialState() {
    return {
      currentHackathon: undefined,
      hackathons: [],
      hackathonDropdownExpanded: false
    };
  },

  componentDidMount: function componentDidMount() {
    var self = this;
    var currentHackathon = SessionStore.getCurrentHackathon();

    HackathonAPI.getHackathons(function updateState(err, res) {
      self.setState({
        hackathons: res,
        currentHackathon: currentHackathon
      });
    });
  },

  componentWillMount: function componentDidMount() {
    SessionStore.addChangeListener(this._onChange);

    this.setState({
      currentHackathon: SessionStore.getCurrentHackathon()
    });
  },

  componentWillUnmount: function componentWillUnmount() {
    SessionStore.removeChangeListener(this._onChange);
  },

  _onChange: function _onChange() {
    this.setState({
      currentHackathon: SessionStore.getCurrentHackathon()
    });
  },

  _onClearHackathon: function _onClearHackathon() {
    SessionActions.clearCurrentHackathon();

    this.setState({
      hackathonDropdownExpanded: false
    });
  },

  _onSelection: function _onSelection(event) {
    var target = event.target;
    var hackathon = this.state.hackathons[target.id];

    SessionActions.updateCurrentHackathon(hackathon);

    this.setState({
      hackathonDropdownExpanded: false
    });
  },

  _onToggleDropdown: function _onToggleDropdown(event) {
    event.preventDefault();

    this.setState({
      hackathonDropdownExpanded: !this.state.hackathonDropdownExpanded
    });
  },

  render: function render() {
    var self = this;
    var currentHackathon = this.state.currentHackathon;
    var hackathons = this.state.hackathons;
    var hackathonDropdown;
    var hackathonName;
    var options;

    if (currentHackathon && currentHackathon.season) {
      hackathonName = currentHackathon.season;
      options = hackathons.map(function mapOptions(hackathon, index) {
        return h('li', {key: index}, [
          h('a', {
            id: index,
            className: 'hi-sudo-link',
            onClick: self._onSelection
          }, hackathon.season)
        ]);
      });
      var allSeasonsOption = h('li', {key: 'all'}, [
        h('a', {
          className: 'hi-sudo-link',
          onClick: self._onClearHackathon
        }, 'All seasons')
      ]);
      options.unshift(allSeasonsOption);
    } else {
      options = hackathons.map(function mapOptions(hackathon, index) {
        return h('li', {key: index}, [
          h('a', {
            id: index,
            className: 'hi-sudo-link',
            onClick: self._onSelection
          }, hackathon.season)
        ]);
      });
    }

    hackathonDropdown = h('li', {className: 'dropdown'}, [
      h('a', {
        href: '#',
        className: 'dropdown-toggle',
        'data-toggle': 'dropdown',
        role: 'button',
        'aria-haspopup': true,
        'aria-expanded': false,
        onClick: this._onToggleDropdown
      }, [
        h('span', hackathonName || 'All seasons'),
        h('span', {className: 'caret'})
      ]),
      h('ul', {className: 'dropdown-menu', style: {
        'display': this.state.hackathonDropdownExpanded ? 'block' : 'none'
      }}, options)
    ]);

    return(
      hackathonDropdown
    );
  }

});

module.exports = HackathonNavModule;
