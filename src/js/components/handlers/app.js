const h = require('react-hyperscript');
const React = require('react');
const Router = require('react-router');

const Footer = require('../footer');
const NavigationBar = require('../navigation');


const App = React.createClass({
  render: function render() {
    return (
      h('div', [
        h(NavigationBar),
        h(Router.RouteHandler),
        h(Footer),
      ])
    );
  },
});


module.exports = App;
