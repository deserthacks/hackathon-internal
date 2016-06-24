const h = require('react-hyperscript');
const React = require('react');
const Router = require('react-router');

const ApplicationAPI = require('../../apis/application.api');
const ApplicationStore = require('../../stores/application.store');
const ApplicationReviewModule = require('../application-review.module');

const ApplicationPage = React.createClass({

  getInitialState: function getInitialState() {
    return {};
  },

  componentWillMount: function componentDidMount() {
    ApplicationStore.addChangeListener(this.onChange);
  },

  componentDidMount: function componentDidMount() {
    this.onChange();
    this.getAdjacentApplications();
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.onChange(nextProps.params);
    this.getAdjacentApplications(nextProps.params);
  },

  componentWillUnmount: function componentWillUnmount() {
    ApplicationStore.removeChangeListener(this.onChange);
  },

  onChange: function onChange(params = {}) {
    const application = ApplicationStore.getApplication(params.id);

    this.setState({
      application,
    });
  },

  getAdjacentApplications: function getAdjacentApplications(params = {}) {
    ApplicationAPI.getAdjacentApplications(params, (err, res) => {
      if (!err && res) {
        this.setState({
          nextApplication: res.next,
          prevApplication: res.previous,
        });
      }
    });
  },

  render: function render() {
    const application = this.state.application;
    let responses = 0;

    if (application) {
      const Response = application.response.map((response) => (
        h('p', { key: responses++ }, response)
      ));
      const prevApplication = this.state.prevApplication;
      const nextApplication = this.state.nextApplication;

      const applicationPageNav = function applicationPageNav() {
        let prevLink;
        let nextLink;

        if (prevApplication) {
          prevLink = h('div', { className: 'pull-left' }, [
            h('span', { className: 'glyphicon glyphicon-chevron-left' }),
            h(Router.Link, {
              to: 'applicationPage',
              params: { id: prevApplication._id },
              activeClassName: 'disabled text-muted',
            }, 'Previous'),
          ]);
        }
        if (nextApplication) {
          nextLink = h('div', { className: 'pull-right' }, [
            h(Router.Link, {
              to: 'applicationPage',
              params: { id: nextApplication._id },
              activeClassName: 'disabled text-muted',
            }, 'Next'),
            h('span', { className: 'glyphicon glyphicon-chevron-right' }),
          ]);
        }

        return h('nav', { className: 'page__nav' }, [
          prevLink,
          nextLink,
        ]);
      };

      return (
        h('div', { className: 'container' }, [
          h('div', { className: 'row' }, [
            h('div', { className: 'col-md-12' }, [
              applicationPageNav(),
            ]),
          ]),
          h('div', { className: 'row' }, [
            h('div', { className: 'col-md-12' }, [
              h('header', { className: 'page__header' }, [
                h('h2', 'Review application'),
              ]),
            ]),
          ]),
          h('div', { className: 'row' }, [
            h('div', { className: 'col-md-3' }, [
              h('div', { className: 'page__sidebar' }, [
                h(ApplicationReviewModule, {
                  application,
                }),
              ]),
            ]),
            h('div', { className: 'col-md-9' }, [
              h('div', { className: 'page__content' }, [
                h('h5', 'Response'),
                Response,
              ]),
            ]),
          ]),
        ])
      );
    }

    return (
      h('div', { className: 'container' }, [
        h('div', { className: 'row' }, [
          h('div', { className: 'col-md-12' }, [
            h('div', { className: 'page__header' }, [
              h('h4', 'Application status...'),
            ]),
            h('div', { className: 'page__content' }, [
              h('h5', 'Response'),
              h('p', 'Application response...'),
            ]),
            h('h3', 'application page'),
          ]),
        ]),
      ])
    );

  },

});

module.exports = ApplicationPage;
