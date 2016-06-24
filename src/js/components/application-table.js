const FixedDataTable = require('fixed-data-table');
const h = require('react-hyperscript');
const moment = require('moment');
const React = require('react');
const Router = require('react-router');

const ROW_HEIGHT = 50;

function renderAcceptedColumn(cellData, cellKey, rowData) {
  let classname = 'fdt-table__cell ';

  if (rowData.status === 'reviewed') {
    if (cellData) {
      classname += 'bg-success';
    } else {
      classname += 'bg-danger';
    }
  } else {
    classname += 'bg-warning';
  }

  return h('div', { className: classname }, [
    h('span', cellData ? 'Accepted' : 'Rejected'),
  ]);
}

function renderCreatedAtColumn(cellData) {
  return h('div', { className: 'fdt-table__cell' }, [
    h('span', moment(cellData).format('lll')),
  ]);
}

function renderHackathonColumn(cellData) {
  return h('div', { className: 'fdt-table__cell' }, [
    h('span', cellData.season),
  ]);
}

function renderReviewerColumn(cellData) {
  if (cellData) {
    return h('div', { className: 'fdt-table__cell' }, [
      h(Router.Link, {
        to: 'dashboard',
        params: { id: cellData._id },
      }, `${cellData.firstName} ${cellData.lastName}`),
    ]);
  }

  return h('div', { className: 'fdt-table__cell' }, [
    h('em', 'Not reviewed yet'),
  ]);
}

function renderUserColumn(cellData) {
  return h('div', { className: 'fdt-table__cell' }, [
    h(Router.Link, {
      to: 'dashboard',
      params: { id: cellData._id },
    }, `${cellData.firstName} ${cellData.lastName}`),
  ]);
}


const ApplicationTable = React.createClass({

  displayName: 'ApplicationTable',

  mixins: [Router.State, Router.Navigation],

  propTypes: {
    applications: React.PropTypes.array,
    onClick: React.PropTypes.func,
    initialLength: React.PropTypes.number,
    filter: React.PropTypes.string,
  },

  getInitialState: function getInitialState() {
    return {
      applicationStats: {},
      applications: [],
      left: 0,
      top: 0,
    };
  },

  componentDidMount: function componentDidMount() {
    this.update();

    if (window.addEventListener) {
      window.addEventListener('resize', this.onResize, false);
    } else if (window.attachEvent) {
      window.attatchEvent('onresize', this.onResize);
    }
  },

  componentWillReceiveProps: function componentWillReceiveProps() {
    this.update();
  },

  onRowClick: function onRowClick(event, index, data) {
    this.props.onClick(data);
  },

  onResize: function onResize() {
    clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(this.update, 16);
  },

  getRow: function getRow(index) {
    const application = this.props.applications[index];

    return application;
  },

  getRowCount: function getRowCount() {
    return this.props.applications.length;
  },

  // TODO: implement
  getRowClass: function getRowClass(index) {
    const application = this.getRow(index);
    let classname = 'hi-table__row';

    if (application) {
      const status = '';

      if (application.accepted) {
        // status = ' bg-success';
      } else {
        // status = ' bg-danger';
      }
      if (application.status === 'received') {
        // status = ' bg-warning';
      }

      classname = `${classname}${status}`;
    }

    return classname;
  },

  update: function update() {
    if (this.isMounted()) {
      const node = React.findDOMNode(this);
      const listHeight = (window.innerHeight < (this.props.initialLength * ROW_HEIGHT)) ?
        (window.innerHeight - 150) : this.props.initialLength * ROW_HEIGHT;

      this.setState({
        renderComp: true,
        tableWidth: node.clientWidth,
        tableHeight: listHeight,
      });
    }
  },

  render: function render() {
    if (this.state.renderComp) {
      return (
        h('div', [
          h(FixedDataTable.Table, {
            rowHeight: ROW_HEIGHT,
            headerHeight: 45,
            groupHeaderHeight: 45,
            rowGetter: this.getRow,
            rowsCount: this.getRowCount(),
            width: this.state.tableWidth,
            height: this.state.tableHeight,
            onRowClick: this.onRowClick,
            rowClassNameGetter: this.getRowClass,
            scrollTop: this.state.top,
            scrollLeft: this.state.left,
            overflowX: 'auto', // TODO: make this more advanced?
            overflowY: 'auto',
          }, [
            h(FixedDataTable.Column, {
              label: 'Hackathon',
              width: 100,
              dataKey: 'hackathon',
              cellRenderer: renderHackathonColumn,
            }),
            h(FixedDataTable.Column, {
              label: 'User',
              width: 200,
              dataKey: 'user',
              cellRenderer: renderUserColumn,
            }),
            h(FixedDataTable.Column, {
              label: 'Status',
              width: 100,
              dataKey: 'status',
            }),
            h(FixedDataTable.Column, {
              label: 'Decision',
              width: 100,
              dataKey: 'accepted',
              cellRenderer: renderAcceptedColumn,
            }),
            h(FixedDataTable.Column, {
              label: 'Role',
              width: 100,
              dataKey: 'role',
            }),
            h(FixedDataTable.Column, {
              label: 'Created At',
              width: 100,
              dataKey: 'createdAt',
              cellRenderer: renderCreatedAtColumn,
            }),
            h(FixedDataTable.Column, {
              label: 'Reviewer',
              width: 200,
              dataKey: 'reviewedBy',
              cellRenderer: renderReviewerColumn,
            }),
            h(FixedDataTable.Column, {
              label: 'Reviewer note',
              width: 200,
              dataKey: 'reviewNote',
              flexGrow: 2,
            }),
            h(FixedDataTable.Column, {
              label: 'ID',
              width: 205,
              dataKey: '_id',
            }),
          ]),
        ])
      );
    }

    return (
      h('div', {}, [

      ])
    );
  },

});


module.exports = ApplicationTable;
