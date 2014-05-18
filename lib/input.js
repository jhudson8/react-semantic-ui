module.exports = function(React, form, common) {

  function getDefaultValue(self, props) {
    return props.defaultValue || self.getModelValue();
  }

  React.mixins.add('modelValueAccessor', {
    getModelValue: function() {
      return this.state && this.state.value || this.props.value;
    },
    setModelValue: function(value) {
      this.setState({value: value});
    }
  });

  var exports = {
    mixins: {all: ['modelValueAccessor']},

    optionsRetriever: function(defaultValue) {
      var rtn = (this.props.options || []).map(function(item) {
        var label, value, selected;
        if (typeof item === 'string') {
          selected = defaultValue === item;
          value = item;
          label = item;
        } else {
          selected = defaultValue === item.value;
          value = item.value;
          label = item.label;
        }
        return {value: value, label: label, selected: selected};
      });
      if (this.props.placeholder) {
        rtn.splice(0, 0, {value: '', label: this.props.placeholder});
      }
      return rtn;
    }
  };

  var classData = {

    /*** Text
     * Standard text field that can display a label and optional field wrapper
     *
     * Properties
     * ----------
     * - ***type***: the input type ("text" by default)
     * - ***value***: the field value
     * - ***name***: the field name
     *
     * *other component attributes will be copied to the input field attributes*
     *
     * *see additional properties from [Field Control](../form/Control.md)*
     *
     * Overrides
     * ---------
     * - ***mixins.Text***: default mixins that should be applied
     *
     * *see [overrides](./overrides.md)*
     *
     * Example
     * --------
     *     var Text = rsui.input.Text;
     *     <Text label="Foo" defaultValue="bar"> ... </Text>
     ***/
    Text: {
      renderInput: function(props) {
        props.type = props.type || 'text';
        props.defaultValue = getDefaultValue(this, props);
        props.className = common.mergeClassNames(props.className, this._className);
        return React.DOM.input(props);
      }
    },

    /*** TextArea
     * Standard textarea field that can display a label and optional field wrapper
     *
     * Properties
     * ----------
     * - ***value***: the field value
     * - ***name***: the field name
     *
     * *other component attributes will be copied to the input field attributes*
     *
     * *see additional properties from [Field Control](../form/Control.md)*
     *
     * Overrides
     * ---------
     * - ***mixins.Text***: default mixins that should be applied
     *
     * *see [overrides](./overrides.md)*
     *
     * Example
     * --------
     *     var Text = rsui.input.Text;
     *     <TextArea label="Foo" defaultValue="bar"> ... </TextArea>
     ***/
    TextArea: {
      renderInput: function(props) {
        props.defaultValue = getDefaultValue(this, props);
        props.className = common.mergeClassNames(props.className, this._className);
        return React.DOM.textarea(props);
      }
    },

    /*** Select
     * Standard select field that can display a label and optional field wrapper.
     * A [fancier control](./Dropdown.md) can be used as well.
     *
     * Properties
     * ----------
     * - ***options***: the available options list (by default can be array of strings, or array of {value, label})
     * - ***value***: the field value
     * - ***name***: the field name
     *
     * *other component attributes will be copied to the input field attributes*
     *
     * *see additional properties from [Field Control](../form/Control.md)*
     *
     * Overrides
     * ---------
     * - ***mixins.Select***: default mixins that should be applied
     * ```optionsRetriever```
     *
     * *see [overrides](./overrides.md)*
     *
     * Example
     * --------
     *      var Select = rsui.input.Select;
     *      <Select label="Foo" defaultValue="abc" options={[{value: '1', label: 'One'}, {value: '2', label: 'Two'}]}/>
     ***/
    Select: {
      defaultContainerClass: function() {
        return common.mergeClassNames('ui dropdown', this.props.type);
      },
      renderInput: function(props) {
        var defaultValue = getDefaultValue(this, props);
            options = exports.optionsRetriever.call(this, defaultValue).map(function(option) {
          return React.DOM.option({value: option.value}, option.label);
        });
        props.defaultValue = defaultValue;
        props.className = common.mergeClassNames(props.className, this._className);
        return React.DOM.select(props, options);
      }
    },

    /*** Checkbox
     * Standard checkbox field that can display a label and optional field wrapper.
     *
     * Properties
     * ----------
     * - ***defaultChecked*** true if the field should be checked in it's initial state
     * - ***value***: the field value ("true" by default)
     * - ***name***: the field name
     *
     * *other component attributes will be copied to the input field attributes*
     *
     * *see additional properties from [Field Control](../form/Control.md)*
     *
     * Overrides
     * ---------
     * - ***mixins.Checkbox***: default mixins that should be applied
     *
     * *see [overrides](./overrides.md)*
     *
     * Example
     * --------
     *     var Checkbox = rsui.input.Checkbox;
     *     <Checkbox label="Foo" defaultChecked={true} defaultValue="abc"/>
     ***/
    Checkbox: {
      defaultLabelAfter: true,
      defaultInlineLabel: true,
      defaultContainerClass: function() {
        return common.mergeClassNames('ui checkbox', this.props.type, this._className);
      },
      renderInput: function(props) {
        var checked = getDefaultValue(this, props);
        if (checked === undefined) {
          checked = this.props.defaultChecked;
        }
        props.defaultChecked = checked;
        props.value = this.props.value || 'true';
        props.type = 'checkbox';
        props.className = common.mergeClassNames(props.className);
        return React.DOM.input(props);
      },
      getDOMValue: function(el) {
        return !!el.checked;
      }
    },

    /*** RadioGroup
     * Collection of radio items field that can display a label and optional field wrapper.  The item
     * data is retrieved in the same way that the [Dropdown](./Dropdown.md) component does.
     *
     * Properties
     * ----------
     * - ***options***: the available options list (by default can be array of strings, or array of {value, label})
     * - ***value***: the field value ("true" by default)
     * - ***name***: the field name
     *
     * *other component attributes will be copied to the input field attributes*
     *
     * *see additional properties from [Field Control](../form/Control.md)*
     *
     * Overrides
     * ---------
     * - ***mixins.RadioGroup***: default mixins that should be applied
     * ```optionsRetriever```
     *
     * *see [overrides](./overrides.md)*
     *
     * Example
     * --------
     *     var RadioGroup = rsui.input.RadioGroup;
     *     <RadioGroup label="Foo" defaultValue="abc" options={[{value: '1', label: 'One'}, {value: '2', label: 'Two'}]}/>
     ***/
    RadioGroup: {
      defaultContainerClass: function() {
        return 'grouped fields inline';
      },
      renderInput: function(props) {
        var self = this,
            state = this.state,
            value = getDefaultValue(this, props),
            options = exports.optionsRetriever.call(this, value).map(function(option) {
              var id = common.uniqueId(),
                  className = common.mergeClassNames('ui radio checkbox', props.className, this._className);
              return React.DOM.div({className: 'field'}, React.DOM.div({className: className},
                React.DOM.input({id: id, type: 'radio', name: props.name, value: option.value,
                    defaultChecked: option.selected, onChange: common.eventBinder(option.value, 'onChange', self)}),
                React.DOM.label({htmlFor: id}, option.label)
              ));
            });
        return options;
      }
    },

    /*** Dropdown
     * Similar to the [Select](./Select.md) component but fancier.  See [examples](http://semantic-ui.com/modules/dropdown.html#/examples)
     * for more details on the actual semantic-ui component.
     *
     * Properties
     * ----------
     * - ***options***: the available options list (by default can be array of strings, or array of {value, label})
     * - ***value***: the field value ("true" by default)
     * - ***name***: the field name
     *
     * *other component attributes will be copied to the input field attributes*
     *
     * *see additional properties from [Field Control](../form/Control.md)*
     *
     * Overrides
     * ---------
     * - ***mixins.Dropdown***: default mixins that should be applied
     * ```optionsRetriever```
     *
     * *see [overrides](./overrides.md)*
     *
     * Example
     * --------
     *     var RadioGroup = rsui.input.RadioGroup;
     *     <RadioGroup label="Foo" defaultValue="abc" options={[{value: '1', label: 'One'}, {value: '2', label: 'Two'}]}/>
     ***/
    Dropdown: {
      render: function() {
        var props = this.props,
            value = getDefaultValue(this, props);
        var options = exports.optionsRetriever.call(this, value).map(function(option) {
          return React.DOM.div({className: common.mergeClassNames('item', option.selected ? 'active' : undefined), 'data-value': option.value}, option.label);
        });
        var inputProps = common.omit(props, ['label', 'className', 'options', 'value', 'icon', 'onChange', 'onShow', 'onHide']);
        inputProps.type = 'hidden';
        inputProps.defaultValue = value;
        return React.DOM.div({className: common.mergeClassNames('ui dropdown ' + (props.type || 'floating'), props.className, this._className)},
          React.DOM.input(inputProps),
          React.DOM.div({className: 'text'}, props.label),
          React.DOM.i({className: (props.icon || 'dropdown') + ' icon'}),
          React.DOM.div({className: 'menu'}, options)
        );
      },
      componentDidMount: function() {
        $(this.getDOMNode()).dropdown({
          onChange: this.props.onChange,
          onShow: this.props.onShow,
          onHide: this.props.onHide
        });
      },
      getDOMValue: function(el) {
        return $(this.getDOMNode()).dropdown('get value');
      }
    }
  };

  common.init(exports, classData, {
    defaults: {
      render: form.fieldRenderer,
      getDOMValue: function(el) {
        return $(el).val();
      }
    },

    ifReactBackbone: function(options) {
      exports.defaultModelSetOptions = {validate: true, allowEmpty: true};
      /**
       * This mixin listenets for onChange events and set the associated model with that value.  If the
       * model change succeeds, the "error" state attribute will be removed.
       */
      React.mixins.add('modelChangeSetter', {
        modifyInputFieldProps: function (props) {
          var onChange = props.onChange,
            model = this.getModel(),
            key = props.key;
          if (props.set === undefined || props.set === true) {
            props.set = exports.defaultModelSetOptions;
            if (props.set) {
              var self = this;
              props.onChange = function (event) {
                var model = self.getModel();
                if (model) {
                  var value = self.getDOMValue(event.currentTarget);
                  if (self.setModelValue(value, props.set) !== false) {
                    // we did not encounter a validation error
                    if (self.state && self.state.error) {
                      self.setState({error: false});
                    }
                  }
                  if (onChange) {
                    onChange.call(self, event);
                  }
                }
              };
            }
          }
          return props;
        }
      }, 'modelValueAccessor', 'modelEventBinder');
      options.mixins = {all: ['modelChangeSetter', 'modelFieldValidator']};
    }
  });

  return exports;
};
