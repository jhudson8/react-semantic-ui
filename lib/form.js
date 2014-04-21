var React = require('react'),
    common = require('./common');

module.exports = {
  signatures: {
    Button: 'ui button',
    Form: 'ui form segment'
  },

  // apply an icon to a button
  applyIcon: function(icon, children) {
    var rtn = [];
    rtn.push(React.DOM.i({className: 'icon ' + icon}));
    React.Children.forEach(children, function(child) {
      rtn.push(child);
    });
    return rtn;
  },

  // apply a loading state to a button
  applyLoadingState: function(className) {
    return {
      icon: 'loading',
      disabled: true
    };
  },

  fieldRenderer: function() {
    var props = this.props,
        state = this.state || {},
        className = 'field',
        id = this.props.id;
        labelAfter = props.labelAfter !== undefined ? props.labelAfter : this.defaultLabelAfter,
        inlineLabel = props.inlineLabel !== undefined ? props.inlineLabel : this.defaultInlineLabel,
        containerClass = common.mergeClassNames(
          props.containerClass, this.defaultContainerClass && this.defaultContainerClass()),
        inputFieldProps = common.omit(props, ['label', 'disabled', 'fieldClass', 'value']),
        error = props.error || state.error;

    if (error) {
      className = common.mergeClassNames(className, 'error');
    }
    if (this.props.disabled) {
      className = common.mergeClassNames(className, 'disabled');
    }
    if (props.fieldClass) {
      className = common.mergeClassNames(props.fieldClass, className);
    }
    if (props.label && !id) {
      id = common.uniqueId();
    }
    if (state.loading || props.loading) {
      containerClass = common.mergeClassNames(containerClass, 'loading');
    }

    inputFieldProps.id = id;
    inputFieldProps.defaultDisabled = this.props.disabled;

    var inputField = this.renderInput(inputFieldProps),
        label = props.label ? React.DOM.label({htmlFor: id}, props.label) : undefined,
        fieldChildren = [],
        containerChildren = [];

    if (containerClass) {
      containerChildren.push(inputField);
      if (inlineLabel && label) {
        containerChildren.splice(labelAfter?1:0, 0, label);
        label = undefined;
      }
      if (error) {
        this.errorRenderer ? this.errorRenderer(error, containerChildren)
            : module.exports.errorRenderer.call(this, error, containerChildren);
      }
      var container = React.DOM.div({className: containerClass}, containerChildren);
      if (label) {
        fieldChildren.push(container);
      } else {
        return container;
      }
    } else if (!label) {
      return inputField;
    } else {
      fieldChildren.push(inputField);
      if (error) {
        this.errorRenderer ? this.errorRenderer(error, fieldChildren)
            : module.exports.errorRenderer.call(this, error, fieldChildren);
      }
    }
    if (label) {
      fieldChildren.splice(labelAfter?1:0, 0, label);
    }
    return React.DOM.div({className: className}, fieldChildren);
  }
};
var signatures = module.exports.signatures;


var classData = {

  /*** Form
   * A form control which reacts to a loading state
   *
   * Properties
   * ----------
   * - loading: true if the form is in a loading state
   * - className: additional form class name ("ui form segment") will already be applied
   *
   * Overrides
   * ---------
   * - signatures.Form: the default form class ("ui form segment")
   * - mixins.Form: default mixins that should be applied to the form
   ***/
  Form: {
    render: function() {
      var props = this.props,
          loading = props.loading || this.state && this.state.loading;
      return React.DOM.form(
          {className: common.mergeClassNames(signatures.Form, props.className, loading ? 'loading' : undefined)},
          props.children);
    }
  },

  /*** Control
   * Form field control meant to provide a label and additon field wrapper elements to
   * arbitrary nested content
   *
   * Properties
   * ----------
   * - id: the id used for the label (for attribute)
   * - label: the field label
   * - inlineLabel: true if the label should be included as a sibling to the nested content
   * - labelAfter: true if the inline label should be applied as the last sibling
   * - containerClass: the inner container element class name
   * - className: the outer field element class name
   * - disabled: true if the field should render as disabled
   * - loading: true if the field should render as loading
   *
   * Overrides
   * ---------
   * - fieldRenderer: function which acts as the render method for this component
   ***/
  Control: {
    render: module.exports.fieldRenderer,
    renderInput: function() {
      return this.props.children;
    }
  },

  /*** Button
   * A standard input button which reacts to a loading state
   *
   * Properties
   * ----------
   * - icon: the [icon name](http://semantic-ui.com/elements/icon.html)
   * - className: additional button class name ("ui button" will already be applied)
   * - disabled: true if the button should be disabled
   * - loading: true if the button is in a loading state
   *
   * Overrides
   * ---------
   * - signatures.Button: the default button class ("ui button")
   * - mixins.Button: default mixins that should be applied to the button
   * - applyIcon: function({children, className, disabled, icon});
   *     apply the icon and update any data for rendering
   * - applyLoadingState: function({children, className, disabled, icon});
   *     apply a loading state and update any data for rendering
   ***/
  Button: {
    render: function() {
      var props = this.props,
          state = this.state || {},
          context = {
            children: props.children,
            className: props.className,
            disabled: props.disabled || state.disabled,
            icon: props.icon
          };

      if (this.props.loading || state.loading) {
        module.exports.applyLoadingState.call(this, context);
      }
      if (context.icon) {
        module.exports.applyIcon.call(this, context);
      }
      if (context.disabled) {
        context.className += ' disabled';
      }
      return this.transferPropsTo(
        React.DOM.button({
          className: common.mergeClassNames('ui button', signatures.Button, context.className)
        }, context.children)
      );
    }
  }
};

common.init(module, classData);
