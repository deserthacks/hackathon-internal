const h = require('react-hyperscript');
const React = require('react');
const Router = require('react-router');

const ApplicationAPI = require('../../apis/application.api');


function buildForm(application) {
  const form = {};

  if (!application) {
    return null;
  }

  form._id = application._id;
  form.open_at = application.open_at.split('.')[0];
  form.close_at = application.close_at.split('.')[0];
  form.decision_at = application.decision_at.split('.')[0];

  return form;
}

/**
 * Application config page. User can edit
 * attributes of an application.
 */
const ApplicationConfig = React.createClass({

  displayName: 'ApplicationConfig',

  mixins: [Router.Navigation, Router.State],

  getInitialState: function getInitialState() {
    return {
      applicationConfig: {},
      configs: [],
      form: {},
    };
  },

  componentDidMount: function componentDidMount() {
    const self = this;
    const params = this.getParams();
    const options = {};

    if (params.id) {
      options.id = params.id;
    }

    ApplicationAPI.getApplicationConfigs(options, (err, applications) => {
      self.setState({
        form: buildForm(applications[0]),
        applicationConfig: applications[0],
      });
    });
  },

  onFormChange: function onFormChange(event) {
    const target = event.target;
    const application = this.state.form;

    application[target.id] = target.value;

    this.setState({
      form: application,
    });
  },

  onFormSubmission: function onFormSubmission(event) {
    const self = this;
    const request = this.state.form;

    ApplicationAPI.updateApplicationConfig(request, (err, application) => {
      self.setState({
        applicationConfig: application,
        form: buildForm(application),
      });
    });

    event.preventDefault();
  },

  getContent: function getContent() {
    const isActiveRoute = this.isActive('form-editor', this.props.params, this.props.query);
    const form = this.state.form;
    let content;

    if (isActiveRoute) {
      content = h(Router.RouteHandler);
    } else {
      content = h('div', { className: 'row' }, [
        h('div', { className: 'col-md-4' }, [
          h('form', [
            h('div', { className: 'form-group' }, [
              h('label', { htmlFor: 'open_at' }, 'Open application submission at:'),
              h('input', {
                type: 'datetime-local',
                className: 'form-control',
                id: 'open_at',
                value: form.open_at,
                onChange: this.onFormChange,
              }),
            ]),
            h('div', { className: 'form-group' }, [
              h('label', { htmlFor: 'close_at' }, 'Close application submission at:'),
              h('input', { type: 'datetime-local',
                className: 'form-control',
                id: 'close_at',
                value: form.close_at,
                onChange: this.onFormChange,
              }),
            ]),
            h('div', { className: 'form-group' }, [
              h('label', { htmlFor: 'decision_at' }, 'Send application decision emails at:'),
              h('input', { type: 'datetime-local',
                className: 'form-control',
                id: 'decision_at',
                value: form.decision_at,
                onChange: this.onFormChange,
              }),
            ]),
            h('div', { className: 'form-group' }, [
              h('button', {
                className: 'btn btn-success',
                onClick: this.onFormSubmission,
              }, 'Update'),
            ]),
          ]),
        ]),
        h('div', { className: 'col-md-8 text-center' }, [
          h('h5', 'Eventual application preview here'),
        ]),
      ]);
    }

    return content;
  },

  getNav: function getNav() {
    const self = this;
    const isActiveRoute = this.isActive('form-editor', this.props.params, this.props.query);

    return (
      h('ul', { className: 'nav nav-pills' }, [
        h('li', {
          role: 'presentation',
        }, [
          h('a', {
            href: '',
            onClick: function goBack() {
              self.goBack();
            },
          }, [
            h('span', { className: 'glyphicon _glyphicon glyphicon-chevron-left' }),
            h('span', 'Back'),
          ]),
        ]),
        h('li', {
          role: 'presentation',
          className: isActiveRoute ? 'pull-right active' : 'pull-right',
        }, [
          h(Router.Link, { to: 'form-editor', params: this.getParams() }, [
            h('span', { className: 'glyphicon _glyphicon glyphicon-edit' }),
            h('span', 'Edit form'),
          ]),
        ]),
      ])
    );
  },

  render: function render() {
    const applicationConfig = this.state.applicationConfig;
    const content = this.getContent();
    const nav = this.getNav();

    return (
      h('div', { className: 'row' }, [
        h('div', { className: 'col-md-12' }, [
          h('h3', `Application role: ${applicationConfig.role}`),
          nav,
        ]),
        h('div', { className: 'col-md-12' }, [
          content,
        ]),
      ])
    );
  },

});


module.exports = ApplicationConfig;
