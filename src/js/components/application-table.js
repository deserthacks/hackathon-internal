'use strict';

var h = require('react-hyperscript');
var React = require('react');
var Router = require('react-router');
var FixedDataTable = require('fixed-data-table');

var ROW_HEIGHT = 150;

var ApplicationTable = React.createClass({

  displayName: 'ApplicationTable',

  mixins: [Router.State, Router.Navigation],

  propTypes: {
    applications: React.PropTypes.array,
    onClick: React.PropTypes.func,
    initialLength: React.PropTypes.number,
    filter: React.PropTypes.string
  },

  getInitialState: function getInitialState() {
    return {
      applicationStats: {},
      applications: [],
      left: 0,
      top: 0
    };
  },

  componentDidMount: function componentDidMount() {
    this._update();

    if (window.addEventListener) {
      window.addEventListener('resize', this._onResize, false);
    } else if (window.attachEvent) {
      window.attatchEvent('onresize', this._onResize);
    }
  },

  componentWillUnmount: function componentWillUnmount() {

  },

  componentWillReceiveProps: function componentWillReceiveProps() {
    this._update();
  },

  _getRow: function _getRow(index) {
    var application = this.props.applications[index];

    return application;
  },

  _getRowCount: function _getRowCount() {
    return this.props.applications.length;
  },

  // TODO: implement
  _getRowClass: function _getRowClass(index) {
    var application = this._getRow(index);

    if (application) {
      if (application.accepted) {
        return '';
      } else {
        return '';
      }
    }
    return '';
  },

  _update: function _update() {
    if (this.isMounted()) {
      var node = React.findDOMNode(this);
      var listHeight = (window.innerHeight < (this.props.initialLength * ROW_HEIGHT)) ? (window.innerHeight - 100) : this.props.initialLength * ROW_HEIGHT;

      this.setState({
        renderComp: true,
        tableWidth: node.clientWidth,
        tableHeight: listHeight
      });
    }
  },

  _onRowClick: function _onRowClick(event, index, data) {
    this.props.onClick(data);
  },

  _onResize: function _onResize() {
    clearTimeout(this._updateTimer);
    this._updateTimer = setTimeout(this._update, 16);
  },

  render: function render() {
    if (this.state.renderComp) {
      return (
        h('div', [
          h(FixedDataTable.Table, {
            rowHeight: ROW_HEIGHT,
            headerHeight: 45,
            groupHeaderHeight: 45,
            rowGetter: this._getRow,
            rowsCount: this._getRowCount(),
            width: this.state.tableWidth,
            height: this.state.tableHeight,
            onRowClick: this._onRowClick,
            rowClassNameGetter: this._getRowClass,
            scrollTop: this.state.top,
            scrollLeft: this.state.left,
            overflowX: 'auto', // TODO: make this more advanced?
            overflowY: 'auto'
          }, [
            h(FixedDataTable.Column, {
              label: 'ID',
              width: 50,
              dataKey: '_id'
            }),
            h(FixedDataTable.Column, {
              label: 'Created At',
              width: 100,
              dataKey: 'createdAt'
            }),
            h(FixedDataTable.Column, {
              label: 'Status',
              width: 100,
              dataKey: 'status'
            }),
            h(FixedDataTable.Column, {
              label: 'Decision',
              width: 100,
              dataKey: 'accepted'
            }),
            h(FixedDataTable.Column, {
              label: 'Role',
              width: 100,
              dataKey: 'role'
            }),
            h(FixedDataTable.Column, {
              label: 'Name',
              width: 200,
              dataKey: 'user'
            })
          ])
        ])
      );
    } else {
      return (
        h('div', {}, [

        ])
      );
    }
  }

});

module.exports = ApplicationTable;
