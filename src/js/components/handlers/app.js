'use strict';

var h = require('react-hyperscript');
var React = require('react');
var Router = require('react-router');

var Footer = require('../footer');
var NavigationBar = require('../navigation');

var App = React.createClass({

  componentDidMount: function componentDidMount() {

  },

  componentWillUnmount: function componentWillUnmount() {

  },

  render: function render() {
    return (
      h('div', [
        h(NavigationBar),
        h(Router.RouteHandler),
        h(Footer)
      ])
    );
  }

});

module.exports = App;
