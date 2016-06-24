const h = require('react-hyperscript');
const React = require('react');
const Router = require('react-router');

const HackathonAPI = require('../apis/hackathon.api');
const SessionActions = require('../actions/session.actions');
const SessionStore = require('../stores/session.store');


const HackathonNavModule = React.createClass({

  displayName: 'HackathonNavModule',

  mixins: [Router.Navigation],

  getInitialState: function getInitialState() {
    return {
      currentHackathon: undefined,
      hackathons: [],
      hackathonDropdownExpanded: false,
    };
  },

  componentWillMount: function componentDidMount() {
    SessionStore.addChangeListener(this.onChange);

    this.setState({
      currentHackathon: SessionStore.getCurrentHackathon(),
    });
  },

  componentDidMount: function componentDidMount() {
    const self = this;
    const currentHackathon = SessionStore.getCurrentHackathon();

    HackathonAPI.getHackathons((err, res) => {
      self.setState({
        hackathons: res,
        currentHackathon,
      });
    });
  },

  componentWillUnmount: function componentWillUnmount() {
    SessionStore.removeChangeListener(this.onChange);
  },

  onChange: function onChange() {
    this.setState({
      currentHackathon: SessionStore.getCurrentHackathon(),
    });
  },

  onClearHackathon: function onClearHackathon() {
    SessionActions.clearCurrentHackathon();

    this.setState({
      hackathonDropdownExpanded: false,
    });
  },

  onSelection: function onSelection(event) {
    const target = event.target;
    const hackathon = this.state.hackathons[target.id];

    SessionActions.updateCurrentHackathon(hackathon);

    this.setState({
      hackathonDropdownExpanded: false,
    });
  },

  onToggleDropdown: function onToggleDropdown(event) {
    event.preventDefault();

    this.setState({
      hackathonDropdownExpanded: !this.state.hackathonDropdownExpanded,
    });
  },

  render: function render() {
    const self = this;
    const currentHackathon = this.state.currentHackathon;
    const hackathons = this.state.hackathons;
    let hackathonName;
    let options;

    if (currentHackathon && currentHackathon.season) {
      hackathonName = currentHackathon.season;
      options = hackathons.map((hackathon, index) => (
        h('li', { key: index }, [
          h('a', {
            id: index,
            className: 'hi-sudo-link',
            onClick: self.onSelection,
          }, hackathon.season),
        ])
      ));
      const allSeasonsOption = h('li', { key: 'all' }, [
        h('a', {
          className: 'hi-sudo-link',
          onClick: self.onClearHackathon,
        }, 'All seasons'),
      ]);
      options.unshift(allSeasonsOption);
    } else {
      options = hackathons.map((hackathon, index) => (
        h('li', { key: index }, [
          h('a', {
            id: index,
            className: 'hi-sudo-link',
            onClick: self.onSelection,
          }, hackathon.season),
        ])
      ));
    }

    return (
      h('li', {
        className: 'dropdown',
        onMouseLeave: this.onToggleDropdown,
      }, [
        h('a', {
          href: '#',
          className: 'dropdown-toggle',
          'data-toggle': 'dropdown',
          role: 'button',
          'aria-haspopup': true,
          'aria-expanded': false,
          onClick: this.onToggleDropdown,
          onMouseOver: this.onToggleDropdown,
        }, [
          h('span', hackathonName || 'All seasons'),
          h('span', { className: 'caret' }),
        ]),
        h('ul', { className: 'dropdown-menu', style: {
          display: this.state.hackathonDropdownExpanded ? 'block' : 'none',
        } }, options),
      ])
    );
  },

});


module.exports = HackathonNavModule;
