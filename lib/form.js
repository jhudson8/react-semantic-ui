var React = require('react'),
    common = require('./common');

module.exports = {

  mixins: {all: []},

  signatures: {
    Button: 'ui button',
    Form: 'ui form segment'
  },

  errorRenderer: function(error, children) {
    children.push(React.DOM.div({className: 'ui red pointing top ui label'}, error));
  },

  // apply an icon to a button
  applyIcon: function(context) {
    var _children = [];
    _children.push(React.DOM.i({className: 'icon ' + context.icon}));
    React.Children.forEach(context.children, function(child) {
      _children.push(child);
    });
    context.children = _children;
  },

  // apply a loading state to a button
  applyLoadingState: function(context) {
    context.icon = 'loading';
    context.disabled = true;
    if (this.props.loadingMessage) {
      context.children = this.props.loadingMessage;
    }
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
    if (this.modifyInputFieldProps) {
      inputFieldProps = this.modifyInputFieldProps(inputFieldProps);
    }

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
   * - ***loading***: true if the form is in a loading state
   * - ***className***: additional form class name ("ui form segment") will already be applied
   *
   * Overrides
   * ---------
   * - ***classNames.Form***: class name to be added to all; default is ```segment```
   * - ***mixins.Form***: default mixins that should be applied
   *
   * Example
   * --------
   *     var Form = rsui.form.Form;
   *     <Form className="my-class" loading={isLoading} onSubmit={handleSubmit}> ... </Form>
   ***/
  Form: {
    render: function() {
      var props = this.props,
          loading = props.loading || this.state && this.state.loading;
      return React.DOM.form(
          {className: common.mergeClassNames(signatures.Form, props.className, loading && 'loading')},
          props.children);
    }
  },

  /*** Control
   * Form field control meant to provide a label and additon field wrapper elements to
   * arbitrary nested content
   *
   * Properties
   * ----------
   * - ***id***: the id used for the label (for attribute)
   * - ***label***: the field label
   * - ***inlineLabel***: true if the label should be included as a sibling to the nested content
   * - ***labelAfter***: true if the inline label should be applied as the last sibling
   * - ***containerClass***: the inner container element class name
   * - ***className***: the outer field element class name
   * - ***disabled***: true if the field should render as disabled
   * - ***loading***: true if the field should render as loading
   *
   * Overrides
   * ---------
   * - ***fieldRenderer***: function which acts as the render method for this component
   * - ***classNames.Control***: class name to be added to all
   * - ***mixins.Control***: default mixins that should be applied
   *
   * Example
   * --------
   *     var Control = rsui.form.Control;
   *     <Control label="Foo" error="some error message to display"> some input field </Control>
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
   * - ***icon***: the [icon name](http://semantic-ui.com/elements/icon.html)
   * - ***className***: additional button class name ("ui button" will already be applied)
   * - ***disabled***: true if the button should be disabled
   * - ***loading***: true if the button is in a loading state
   *
   * Overrides
   * ---------
   * - ***classNames.Button***: class name to be added to all
   * - ***mixins.Button***: default mixins that should be applied
   * - ***applyIcon***: ```function({children, className, disabled, icon})```
   *     apply the icon and update any data for rendering
   * - ***applyLoadingState***: ```function({children, className, disabled, icon})```
   *     apply a loading state and update any data for rendering
   *
   * Example
   * --------
   *     var Button = rsui.form.Button;
   *     <Button icon="comment" onClick={myClickHandler}> Click me </Control>
   *     <Button loading={true} label="This is loading"/>
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
      if (this.props.label) {
        context.children = [this.props.label];
      }
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
