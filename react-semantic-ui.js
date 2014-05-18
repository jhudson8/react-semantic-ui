/*!
 * react-semantic-ui v0.2.0 (https://github.com/jhudson8/react-semantic-ui)
 * 
 * Copyright (c) 2014 Joe Hudson<joehud_AT_gmail.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
function lib(React) {
  var common = require('./lib/common')(React),
      form = require('./lib/form')(React, common);
  return {
    form: form,
    input: require('./lib/input')(React, form, common),
    layout: require('./lib/layout')(React, common)
  };
}

if (global.React) {
  global.rsui = lib(global.React);
} else {
  module.exports = lib;
}
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./lib/common":2,"./lib/form":3,"./lib/input":4,"./lib/layout":5}],2:[function(require,module,exports){
var cache = { id: 0 },
    reactBackboneAware = !!React.mixins.exists('modelFieldValidator');

module.exports = function(React) {
  return {
    uniqueId: function() {
      return 'rsui-' + cache.id++;
    },

    defaults: function() {
      var base = arguments[0],
          current;
      for (var i=1; i<arguments.length; i++) {
        current = arguments[i];
        for (var name in current) {
          if (base[name] === undefined) {
            base[name] = current[name];
          }
        }
      }
      return base;
    },

    omit: function(data, keys) {
      var rtn = {};
      for (var name in data) {
        if (keys.indexOf(name) === -1) {
          rtn[name] = data[name];
        }
      }
      return rtn;
    },

    mergeClassNames: function() {
      var rtn = '';
      for (var i=0; i<arguments.length; i++) {
        if (arguments[i]) {
          if (rtn.length > 0) rtn += ' ';
          rtn += arguments[i];
        }
      }
      return rtn && rtn;
    },

    eventBinder: function(value, type, context, cancelEvent) {
      return function(event) {
        if (cancelEvent) {
          event.stopPropagation();
          event.preventDefault();
        }
        if (context[type]) {
          context[type](value, event);
        }
        if (context.props[type]) {
          context.props[type](value, event);
        }
      };
    },

    result: function(value, context) {
      if (typeof value === 'function') {
        return value.call(context);
      } else {
        return value;
      }
    },

    init: function(exports, classData, options) {
      options = options || {};

      // allow for special setup if https://github.com/jhudson8/react-backbone is installed
      if (reactBackboneAware && options.ifReactBackbone) {
        options.ifReactBackbone(options);
      }

      var _mixins = exports.mixins;
      if (!exports.mixins) {
        _mixins = exports.mixins || {all: []};
      }

      function _init() {
        for (var name in classData) {
          var data = classData[name],
              spec = {};
          for (var _name in data) {
            spec[_name] = data[_name];
          }
          if (options.defaults) {
            for (var fName in options.defaults) {
              if (!spec[fName]) {
                spec[fName] = options.defaults[fName];
              }
            }
          }
          options.mixins = options.mixins || {};
          spec.mixins = [spec.mixins, _mixins[name], _mixins.all, options.mixins[name], options.mixins.all];
          exports[name] = React.createClass(spec);
        }
      }

      exports.reset = _init;
      exports.classData = classData;
      _init();
    }
  };
};

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
module.exports = function(React, common) {
  var exports = {
    totalPageRetriever: function() {
      return this.props.totalPages;
    },

    valueRetriever: function(column, entry) {
      if (entry.get) {
        return entry.get(column.key);
      }
      return entry[column.key];
    },

    keyRetriever: function(entry) {
      return entry.id || entry.key;
    },

    entriesRetriever: function(entries) {
      if (entries.models) {
        return entries.models;
      }
      return entries;
    }
  };
  
  var classData = {

    Loader: {
      render: function() {
        var props = this.props,
            loading = this.state && this.state.loading || props.loading;

        if (this.props.loading || this.state && this.state.loading) {
          var className = common.mergeClassNames('ui', 'segment', props.className);
              loadingClass = common.mergeClassNames('ui active', props.type || 'inverted dimmer');
          return React.DOM.div({className: className},
                  React.DOM.div({className: loadingClass},
                    React.DOM.div({className: 'ui loader' + (props.label ? ' text' : '')}, props.label)),
                  this.props.children);
        } else {
          return React.DOM.div({className: props.className}, this.props.children);
        }
      }
    },


    Steps: {
      getInitialState: function() {
        return {
          active: this.props.active || this.props.steps[0].key
        };
      },
      render: function() {
        var self = this,
            props = this.props,
            className = common.mergeClassNames('ui steps', props.type, props.className),
            activeStep = this.state.active,
            children = props.steps.map(function(step) {
              var className = common.mergeClassNames('ui step', step.key === activeStep ? 'active' : undefined, step.disabled ? 'disabled' : undefined);
              return React.DOM.div({className: className, onClick: self.clicker(step)}, step.label);
            });
        return React.DOM.div({className: className}, children);
      },
      clicker: function(step) {
        var self = this;
        return function() {
          if (!step.disabled) {
            var rtn = self.props.onChange && self.props.onChange(step);
            if (rtn === undefined || rtn) {
              self.setState({active: step.key});
            }
          }
        };
      }
    },


    /*** Paginator
     * A paginator component.
     *
     * Properties
     * ----------
     * - ***totalPages***: the number of total pages
     * - ***className***: additional top level class name
     * - ***page***: (default: 1) the current page number (1-based)
     * - ***radius***: (default: 1) the number of page links (moving out from current page) to show
     * - ***anchor***: (default: 1) the number of page links (moving out from each end) to show
     * - ***onChange***: called when the user clicked a page number
     *
     * Example
     * ---------
     *     <Paginator page={2} totalPages={12} onChange={funtion(pageNumber) {...}}/>
     ***/
    Paginator: {
      getInitialState: function() {
        return {
          page: this.props.page || 1
        };
      },

      render: function() {
        var totalPages = exports.totalPageRetriever.call(this);
        if (totalPages && totalPages > 1) {
          var current = this.state.page,
              radius = this.props.radius || 0,
              anchor = this.props.anchor || 1,
              separator = this.props.separator || '...',
              min = Math.max(current - radius, 1),
              max = Math.min(current + radius, totalPages),
              showArrows = this.props.showArrows === undefined ? true : this.props.showArrows,
              totalShowing = (radius * 2) + (anchor * 2) + 3 /* current + separator */,
              showRightSeparator = (totalPages > current + radius + anchor),
              showLeftSeparator = (current  > (anchor + Math.max(1, radius))),
              compact = this.props.compact,
              index = {},
              children = [];
          if (compact) {
            showArrows = false;
          }

          if (showLeftSeparator) {
            totalShowing--;
          }
          if (showRightSeparator) {
            totalShowing--;
          }

          var i;
          // starting anchor
          for (i=1; i<=anchor && i<=totalPages; i++) {
            children.push(i);
            index[i] = children.length;
          }

          // radius
          for (i=min; i<=max; i++) {
            if (!index[i]) {
              children.push(i);
              index[i] = children.length;
            }
          }

          // upper anchor
          for (i=Math.max(totalPages-anchor+1, current+1); i<=totalPages; i++) {
            if (!index[i]) {
              children.push(i);
              index[i] = children.length;
            }
          }

          // always keep the same number of indicators showing - start down from middle
          for (i=current; i > 0 && children.length < totalShowing; i--) {
            if (typeof index[i] === 'undefined') {
              _idx = index[i+1]-1;
              children.splice(_idx, 0, i);
              index[i] = _idx+1;
            }
          }
          for (i=current; children.length < totalShowing && children.length < totalPages; i++) {
            if (!index[i]) {
              children.splice(i-1, 0, i);
            }
          }

          // map the children to components
          var self = this;
          children = children.map(function(child) {
            if (child === current) {
              return React.DOM.div({className: 'active item'}, child);
            } else {
              return React.DOM.a({className: 'item', href: '#' + child, onClick: common.eventBinder(child, 'onChange', self, true)}, child);
            }
          });

          // separators
          if (showLeftSeparator) {
            if (compact) {
              children.splice(anchor, 0, React.DOM.a({className: 'icon item'}, React.DOM.i({className: 'left arrow icon', onClick: common.eventBinder(current-1, 'onChange', self, true)})));
            } else {
              children.splice(anchor, 0, React.DOM.div({className: 'disabled item'}, separator));
            }
          }
          if (showRightSeparator) {
            if (compact) {
              children.splice(children.length-anchor, 0, React.DOM.a({className: 'icon item'}, React.DOM.i({className: 'right arrow icon', onClick: common.eventBinder(current+1, 'onChange', self, true)})));
            } else {
              children.splice(children.length-anchor, 0, React.DOM.div({className: 'disabled item'}, separator));
            }
          }

          // arrows
          if (showArrows) {
            var nodeName, className;
            if (current === 1) {
              nodeName = 'div';
              className = 'icon disabled item';
            } else {
              nodeName = 'a';
              className = 'icon item';
            }
            children.splice(0, 0, React.DOM[nodeName]({
              className: className, onClick: current > 1 ? common.eventBinder(current-1, 'onChange', self, true) : undefined
            }, React.DOM.i({className: 'left arrow icon'})));

            if (current === totalPages) {
              nodeName = 'div';
              className = 'icon disabled item';
            } else {
              nodeName = 'a';
              className = 'icon item';
            }
            children.splice(children.length, 0, React.DOM[nodeName]({
              className: className, onClick: current < totalPages ? common.eventBinder(current+1, 'onChange', self, true) : undefined
            }, React.DOM.i({className: 'right arrow icon'})));
          }

          return React.DOM.div({className: 'ui pagination menu'}, children);

        } else {
          return React.DOM.div();
        }
      },

      onChange: function(pageNumber) {
        this.setState({
          page: pageNumber
        });
      },

      setPage: function(pageNumber) {
        this.setState({
          page: pageNumber
        });
      }
    },


    Menu: {
      getInitialState: function() {
        return {
          active: this.props.active || this.props.items[0].key
        };
      },
      render: function() {
        var self = this,
            props = this.props,
            items = props.items || [],
            activeKey = this.state.active,
            active;
        for (var i=0; i<items; i++) {
          if (activeKey === items[i].key) {
            active = items[i];
            break;
          }
        }
        var children = items.map(function(item) {
          return React.DOM.a({className: common.mergeClassNames((item.key === activeKey) && 'active', 'item', item.className), href: item.href || item.key,
              onClick: item.href ? props.onClick : common.eventBinder(item, 'onChange', self, true)}, item.icon ? React.DOM.i({className: item.icon + ' icon'}) : undefined, item.label);
        });

        return React.DOM.div({className: common.mergeClassNames('ui menu', props.className)},
          children,
          props.children
        );
      },
      onChange: function(item) {
        this.setState({active: item.key});
        if (item.activate) {
          item.activate();
        }
      },
      setActive: function(key) {
        this.setState({active: key});
      }
    },


    Tabs: {
      getInitialState: function() {
        return {
          active: this.props.active || this.props.tabs[0].key
        };
      },
      render: function() {
        var self = this,
            props = this.props,
            tabs = props.tabs || [],
            type = props.type || 'top attached tabular',
            bodyType = props.bodyType || 'bottom attached segment',
            activeKey = this.state.active,
            active;
        for (var i=0; i<props.tabs.length; i++) {
          if (activeKey === props.tabs[i].key) {
            active = props.tabs[i];
            break;
          }
        }

        var tabLabels = tabs.map(function(tab) {
          return React.DOM.a({className: common.mergeClassNames((tab.key === activeKey) && 'active', 'item', tab.className), href: tab.key,
              onClick: common.eventBinder(tab, 'onChange', self, true)}, tab.icon ? React.DOM.i({className: tab.icon + ' icon'}) : undefined, tab.label);
        });
        var pageComponent = active.page();

        return React.DOM.div({className: props.className},
          React.DOM.div({className: 'ui ' + type + ' menu'},
            tabLabels
          ),
          React.DOM.div({className: 'ui ' + bodyType},
            pageComponent
          )
        );
      },

      onChange: function(tab) {
        this.setState({active: tab.key});
      }
    },


    Table: {
      render: function() {
        var self = this,
            props = this.props;
        var cols = props.cols.map(function(col) {
          var label = common.result(col.label),
              className = col.colClass;
          if (typeof className === 'function') {
            className = className.call(self, value, col);
          }
          return React.DOM.th({className: className}, label);
        });

        var index = 0,
            rows = exports.entriesRetriever.call(this, props.entries).map(function(entry) {
              var cells = props.cols.map(function(col) {
                var value = exports.valueRetriever.call(this, col, entry),
                    cellClassName = col.cellClassName;
                if (typeof cellClassName === 'function') {
                  cellClassName = cellClassName.call(self, value, col);
                }
                index++;
                if (col.formatter) {
                  value = col.formatter.call(this, value, entry, index, col);
                }
                if (col.factory) {
                  value = col.factory.call(this, value, entry, index, col);
                }
                return React.DOM.td({className: cellClassName, key: col.key}, value);
              });
              var className = props.rowClassName && props.rowClassName.call(this, entry);
              return React.DOM.tr({className: className, key: exports.keyRetriever(entry)}, cells);
            });

        return React.DOM.table({className: common.mergeClassNames('ui table', props.className)},
          React.DOM.thead(undefined, cols),
          React.DOM.tbody(undefined, rows)
        );
      }
    }
  };

  common.init(exports, classData);

  return exports;
};

},{}]},{},[1])