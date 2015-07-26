'use strict';

var h = require('react-hyperscript');
var React = require('react');
var Router = require('react-router');

var ApplicationHandler = React.createClass({

  render: function render() {
    return (
      h('div', {className: 'container'}, [
        h(Router.RouteHandler)
      ])
    );
  }

});

module.exports = ApplicationHandler;
