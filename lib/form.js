module.exports = function(React, common) {
  var exports = {

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
          className = common.mergeClassNames('field', this._controlClassName && this._controlClassName()),
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
          if (this.errorRenderer) {
            this.errorRenderer(error, containerChildren);
          } else {
            exports.errorRenderer.call(this, error, containerChildren);
          }
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
          if (this.errorRenderer) {
            this.errorRenderer(error, fieldChildren);
          } else {
            exports.errorRenderer.call(this, error, fieldChildren);
          }
        }
      }
      if (label) {
        fieldChildren.splice(labelAfter ? 1 : 0, 0, label);
      }
      return React.DOM.div({className: className}, fieldChildren);
    }
  };

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
            attributes = common.defaults({
              className: common.mergeClassNames('ui form', this._className, props.className, loading && 'loading')
            }, this.props);
        return React.DOM.form(attributes, props.children);
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
     * - ***mixins.Control***: default mixins that should be applied
     *
     * Example
     * --------
     *     var Control = rsui.form.Control;
     *     <Control label="Foo" error="some error message to display"> some input field </Control>
     ***/
    Control: {
      render: exports.fieldRenderer,
      renderInput: function() {
        return this.props.children;
      },
      _controlClassName: function() {
        return  this._className;
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
          exports.applyLoadingState.call(this, context);
        }
        if (context.icon) {
          exports.applyIcon.call(this, context);
        }
        if (context.disabled) {
          context.className += ' disabled';
        }
        var attributes = common.defaults({
          className: common.mergeClassNames('ui button', this._className, context.className)
        }, this.props);
        return React.DOM.button(attributes, context.children);
      }
    }
  };

  common.init(exports, classData, {
    ifReactBackbone: function(options) {
      options.mixins = {
        Button: ['modelLoadOn'],
        Form: ['modelAsyncListener']
      };
    }
  });

  return exports;
};
