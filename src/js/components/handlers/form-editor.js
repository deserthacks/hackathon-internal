'use strict';

var classnames = require('classnames');
var h = require('react-hyperscript');
var React = require('react');

var ApplicationAPI = require('../../apis/application.api');

var MODULE_TYPES = {
  SHORT_TEXT: 'short_text',
  LONG_TEXT: 'long_text',
  MULTIPLE_CHOICE: 'multiple_choice',
  DROPDOWN: 'dropdown'
};

var LongTextModule = React.createClass({

  render: function render() {
    return (
      h('span', 'LongTextModule')
    );
  }

});

var MultipleChoiceModule = React.createClass({

  render: function render() {
    return (
      h('span', 'MultipleChoiceModule')
    );
  }

});

var DropdownModule = React.createClass({

  render: function render() {
    return (
      h('span', 'DropdownModule')
    );
  }

});

var ShortTextModule = React.createClass({

  displayName: 'ShortTextModule',

  getInitialState: function getInitialState() {
    return {
      name: '',
    };
  },

  handleFormChange: function handleFormChange(event) {
    var target = event.target;
  },

  render: function render() {
    console.log('%s render!', 'ShortTextModule');

    return (
      h('div', [
        h('form', [
          h('div', {className: 'form-group'}, [
            h('label', {htmlFor: 'name'}, 'Module name'),
            h('input', {type: 'text', className: 'form-control', id: 'name', onChange: this.handleFormChange})
          ]),
          h('div', {className: 'form-group'}, [
            h('label', {htmlFor: 'question'}, 'Question'),
            h('input', {type: 'text', className: 'form-control', id: 'question', onChange: this.handleFormChange})
          ]),
          h('div', {className: 'form-group'}, [
            h('label', {htmlFor: 'max_length'}, 'Max length'),
            h('input', {type: 'text', className: 'form-control', id: 'max_length', onChange: this.handleModuleCreation})
          ]),
          h('div', {className: 'form-group'}, [
            h('div', {className: 'checkbox'}, [
              h('label', [
                h('input', {type: 'checkbox'}),
                'Required'
              ])
            ])
          ])
        ])
      ])
    );
  }

});

// thing you use to arrange/high level config on form modules
// drag n drop
var ModuleContainer = React.createClass({

  displayName: 'ModuleContainer',

  propTypes: {
    modules: []
  },

  getInitialState: function getInitialState() {
    return {};
  },

  render: function render() {
    console.log('%s render!', 'ModuleContainer');

    var Modules = this.props.modules.map(function(module) {
      return h('div', {className: 'module__box'}, [
        h('p', module.name),
        h('p', module.question),
        h('button', 'Wow')
      ]);
    });

    return (
      h('div', {className: 'row'}, [
        h('div', {className: 'col-md-12'}, [
          h('span', 'Module container'),
          Modules
        ])
      ])
    );
  }

});

// thing you use to create a module
// select from list of predefined types
//    short text, long text, dropdown, etc.
var ModuleCreator = React.createClass({

  displayName: 'ModuleCreator',

  getInitialState: function getInitialState() {
    return {
      type: ''
    };
  },

  propTypes: {
    // on module completion
    onCreation: React.PropTypes.func
  },

  componentDidMount: function componentDidMount() {

  },

  handleCreation: function handleCreation(event) {
    var target = event.target;

    console.log(target);

    this.props.onCreation({name: target.id});
  },

  handleSelection: function handleSelection(event) {
    var target = event.target;

    console.log(target);

    this.setState({
      type: target.id
    });

    console.log(this.state);
  },

  render: function render() {
    console.log('%s render!', 'ModuleCreator');
    var editor;

    switch (this.state.type) {
      case MODULE_TYPES.SHORT_TEXT:
        editor = h(ShortTextModule);
        break;

      case MODULE_TYPES.LONG_TEXT:
        editor = h(LongTextModule);
        break;

      case MODULE_TYPES.MULTIPLE_CHOICE:
        editor = h(MultipleChoiceModule);
        break;

      case MODULE_TYPES.DROPDOWN:
        editor = h(DropdownModule);
        break;

      default:
        editor = h('div', {className: 'text-center'}, [
          h('h5', 'Select a module type on the right!')
        ]);
        break;
    }

    return (
      h('div', {className: 'module__container'}, [
        h('div', {className: 'row'}, [
          h('div', {className: 'col-md-4'}, [
            h('ul', {className: 'list-unstyled'}, [
              h('li', {className: ''}, [
                h('span', {className: 'hi-sudo-link', onClick: this.handleSelection, id: 'short_text'}, 'Short text')
              ]),
              h('li', {className: ''}, [
                h('span', {className: 'hi-sudo-link', onClick: this.handleSelection, id: 'long_text'}, 'Long text')
              ]),
              h('li', {className: ''}, [
                h('span', {className: 'hi-sudo-link', onClick: this.handleSelection, id: 'multiple_choice'}, 'Multiple choice')
              ]),
              h('li', {className: ''}, [
                h('span', {className: 'hi-sudo-link', onClick: this.handleSelection, id: 'dropdown'}, 'Dropdown')
              ])
            ])
          ]),
          h('div', {className: 'col-md-8'}, [
            editor,
            h('div', [
              h('ul', {className: 'list-inline'}, [
                h('li', [
                  h('button', {className: 'btn btn-primary', onClick: this.handleCreation}, 'Add module')
                ])
              ])
            ])
          ])
        ])
      ])
    );
  }

});

/**
 * Application form creator.
 */
var FormEditor = React.createClass({

  displayName: 'FormEditor',

  getInitialState: function getInitialState() {
    return {
      modules: []
    };
  },

  componentWillMount: function componentWillMount() {

  },

  componentDidMount: function componentDidMount() {

  },

  handleModuleCreation: function handleModuleCreation(module) {
    var modules = this.state.modules;

    modules.push(module);

    this.setState({
      modules: modules
    });
  },

  render: function render() {
    console.log('%s render!', 'formEditor');

    return(
      h('div', {className: 'container'}, [
        h('div', {className: 'row'}, [
          h('div', {className: 'col-md-12'}, [
            h(ModuleCreator, {
              onCreation: this.handleModuleCreation
            })
          ])
        ]),
        h('div', {className: 'row'}, [
          h('div', {className: 'col-md-12'}, [
            h(ModuleContainer, {
              modules: this.state.modules
            })
          ])
        ]),
        h('div', {className: 'row'}, [
          h('div', {className: 'col-md-12'}, [

          ])
        ])
      ])
    );
  }

});

module.exports = FormEditor;
