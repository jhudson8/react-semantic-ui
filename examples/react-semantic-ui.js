var rsui = (function() {
function resolver(name) { return root[name.substring(name.indexOf("./") == 0 ? 2 : 0)] }
var root = {react: React}, module;

module = {};
(function(require, module) {
var dependsOn = {},
    mixins = {};
/*** API
 * The ```rsui.mixins``` namespace provides utility methods to deal with mixin dependency management and named mixin registration.
 *
 * Functions
 * ----------
 * - ***get(mixins...)***: each mixin can be a mixin object, an array of other mixins, or a string representing a registered mixin (see add function).
 *    Any mixins dependencies that were registered with a named mixin will be included first.
 * - ***add(name, mixin[, depends...]) register a named mixin
 *    - ***name***: the mixin name
 *    - ***mixin***: the mixin object
 *    - ***depends***: any number of string values representing a registered mixin to mark as a dependency to this mixin
 ***/
function get(values, index, rtn) {
  function addTo(name) {
    if (!index[name]) {
      var mixin = mixins[name];
      if (mixin) {
        var depends = dependsOn[name];
        if (depends) {
          for (var i=0; i<depends.length; i++) {
            addTo(depends[i]);
          }
        }
        rtn.push(mixin);
        index[name] = true;
      } else {
        throw "invalid mixin '" + name + "'";
      }
    }
  }

  for (var i=0; i<values.length; i++) {
    var mixin = values[i];
    if (mixin) {
      if (Array.isArray(mixin)) {
        get(mixin, index, rtn);
      } else if (typeof mixin === 'string') {
        addTo(mixin);
      } else {
        rtn.push(mixin);
      }
    }
  }
}

module.exports = {

  get: function() {
    var rtn = [],
        index = {};
    get(Array.prototype.slice.call(arguments), index, rtn);
    return rtn;
  },

  add: function(name, mixin) {
    var depends = Array.prototype.slice.call(arguments, 2);
    dependsOn[name] = depends.length && depends;
    mixins[name] = mixin;
  }
};

})(resolver, module);
root["mixins"] = module.exports;


module = {};
(function(require, module) {
var React = require('react'),
    mixins = require('mixins')
    cache = {
      id: 0
    };

module.exports = {
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
    return rtn;
  },

  eventBinder: function(value, type, context, cancelEvent) {
    return function(event) {
      if (cancelEvent) {
        event.stopPropagation();
        event.preventDefault();
      }
      context[type] && context[type](value, event);
      context.props[type] && context.props[type](value, event);
    };
  },

  result: function(value, context) {
    if (typeof value === 'function') {
      return value.call(context);
    } else {
      return value;
    }
  },

  init: function(_module, classData, options) {
    options = options || {};
    var exports = _module.exports,
        _mixins = exports.mixins;
    if (!exports.mixins) {
      _mixins = exports.mixins || {};
    }

    function _init() {
      for (var name in classData) {
        var data = classData[name];
        if (options.defaults) {
          for (var fName in options.defaults) {
            if (!data[fName]) {
              data[fName] = options.defaults[fName];
            }
          }
        }
        data.mixins = mixins.get(data.mixins, _mixins[name], _mixins.all);
        exports[name] = React.createClass(data);
      }
    }

    exports.reset = _init;
    exports.classData = classData;
    _init();
  }
};

})(resolver, module);
root["common"] = module.exports;


module = {};
(function(require, module) {
var React = require('react'),
    common = require('./common');

module.exports = {

  mixins: {all: []},

  signatures: {
    Form: 'segment'
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
          attributes = common.defaults({
            className: common.mergeClassNames('ui form', signatures.Form, props.className, loading && 'loading')
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
      var attributes = common.defaults({
        className: common.mergeClassNames('ui button', signatures.Button, context.className)
      }, this.props);
      return React.DOM.button(attributes, context.children);
    }
  }
};

common.init(module, classData);

})(resolver, module);
root["form"] = module.exports;


module = {};
(function(require, module) {
var React = require('react'),
    common = require('./common'),
    form = require('./form');

module.exports = {

  mixins: {all: []},

  /*** overrides
   * Overrides can be used to change how all input components work without having to override each individually.
   * The following are available
   *
   * - ***valueAccessor***: function called with *this* as the owner component to retrieve the input field value
   * - ***optionsRetriever***: function called with *this* as the owner component  used to return all available options used for a list of components as ```[{value, label, selected}]```
   ***/

  valueAccessor: function() {
    return this.state && this.state.value || this.props.defaultValue;
  },

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

function getValue(obj) {
  return module.exports.valueAccessor.call(obj);
}

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
   * - ***classNames.Text***: class name to be added to all
   * - ***mixins.Text***: default mixins that should be applied
   * ```valueAccessor```
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
      props.defaultValue = getValue(this);
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
   * ```valueAccessor```
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
      props.defaultValue = getValue(this);
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
   * - ***classNames.Select***: class name to be added to all
   * - ***mixins.Select***: default mixins that should be applied
   * ```valueAccessor```, ```optionsRetriever```
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
      var options = module.exports.optionsRetriever.call(this, props.defaultValue).map(function(option) {
        return React.DOM.option({value: option.value}, option.label);
      });
      props.defaultValue = getValue(this);
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
   * - ***classNames.Checkbox***: class name to be added to all
   * - ***mixins.Checkbox***: default mixins that should be applied
   * ```valueAccessor```
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
      return common.mergeClassNames('ui checkbox', this.props.type);
    },
    renderInput: function(props) {
      props.defaultChecked = this.props.defaultChecked;
      props.value = this.props.value || 'true';
      props.type = 'checkbox';
      return React.DOM.input(props);
    },
    getModelValue: function(el) {
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
   * - ***classNames.RadioGroup***: class name to be added to all
   * - ***mixins.RadioGroup***: default mixins that should be applied
   * ```valueAccessor```, ```optionsRetriever```
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
          value = getValue(this),
          options = module.exports.optionsRetriever.call(this, value).map(function(option) {
            var id = common.uniqueId();
            return React.DOM.div({className: 'field'}, React.DOM.div({className: 'ui radio checkbox'},
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
   * - ***classNames.Dropdown***: class name to be added to all
   * - ***mixins.Dropdown***: default mixins that should be applied
   * ```valueAccessor```, ```optionsRetriever```
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
          value = getValue(this);
      var options = module.exports.optionsRetriever.call(this, value).map(function(option) {
        return React.DOM.div({className: common.mergeClassNames('item', option.selected ? 'active' : undefined), 'data-value': option.value}, option.label);
      });
      var inputProps = common.omit(props, ['label', 'className', 'options', 'value', 'icon', 'onChange', 'onShow', 'onHide']);
      inputProps.type = 'hidden';
      inputProps.defaultValue = value;
      return React.DOM.div({className: common.mergeClassNames('ui dropdown ' + (props.type || 'floating'), props.className)},
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
    getModelValue: function(el) {
      return $(this.getDOMNode()).dropdown('get value');
    }
  }
};

common.init(module, classData, {
  defaults: {
    render: form.fieldRenderer,
    getModelValue: function(el) {
      return $(el).val();
    }
  }
});

})(resolver, module);
root["input"] = module.exports;


module = {};
(function(require, module) {
var React = require('react'),
    common = require('./common');

function init() {
  module.exports.Loader = React.createClass({

    mixins: module.exports.LoadAwareMixins,

    render: function() {
      var props = this.props,
          loading = this.state && this.state.loading || props.loading;

      if (this.props.loading || this.state && this.state.loading) {
        var className = common.mergeClassNames('ui segment', props.className);
            loadingClass = common.mergeClassNames('ui active', props.type || 'inverted dimmer');
        return React.DOM.div({className: className},
                React.DOM.div({className: loadingClass},
                  React.DOM.div({className: 'ui loader' + (props.label ? ' text' : '')}, props.label)),
                this.props.children);
      }
    }
  });

  module.exports.Steps = React.createClass({
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
            var className = common.mergeClassNames('ui step', step.key === activeStep ? 'active' : 'undefined', step.disabled ? 'disabled' : undefined);
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
  });

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
  module.exports.Paginator = React.createClass({
    getInitialState: function() {
      return {
        page: this.props.page || 1
      };
    },

    render: function() {
      var totalPages = module.exports.totalPageRetriever.call(this);
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

        // starting anchor
        for (var i=1; i<=anchor && i<=totalPages; i++) {
          children.push(i);
          index[i] = children.length;
        }

        // radius
        for (var i=min; i<=max; i++) {
          if (!index[i]) {
            children.push(i);
            index[i] = children.length;
          }
        }

        // upper anchor
        for (var i=Math.max(totalPages-anchor+1, current+1); i<=totalPages; i++) {
          if (!index[i]) {
            children.push(i);
            index[i] = children.length;
          }
        }

        // always keep the same number of indicators showing - start down from middle
        for (var i=current; i > 0 && children.length < totalShowing; i--) {
          if (typeof index[i] === 'undefined') {
            _idx = index[i+1]-1;
            children.splice(_idx, 0, i);
            index[i] = _idx+1;
          }
        }
        for (var i=current; children.length < totalShowing && children.length < totalPages; i++) {
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
  });

  module.exports.Menu = React.createClass({
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
        return React.DOM.a({className: common.mergeClassNames((item.key === activeKey) && 'active', 'item', item.className), href: item.key,
            onClick: common.eventBinder(item, 'onChange', self, true)}, item.icon ? React.DOM.i({className: item.icon + ' icon'}) : undefined, item.label);
      });

      return React.DOM.div({className: common.mergeClassNames('ui menu', props.className)},
        children,
        props.children
      );
    },
    onChange: function(item) {
      this.setState({active: item.key});
      item.activate && item.activate();
    }
  });

  module.exports.Tabs = React.createClass({
    getInitialState: function() {
      return {
        active: this.props.active || this.props.tabs[0].key
      };
    },
    render: function() {
      var self = this,
          props = this.props,
          tabs = props.tabs,
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
            onClick: common.eventBinder(tab, 'onChange', self, true)}, tab.label);
      });
      var pageComponent = active.page();

      return React.DOM.div({className: props.className},
        React.DOM.div({className: 'ui top attached tabular menu'},
          tabLabels
        ),
        React.DOM.div({className: 'ui bottom attached segment'},
          pageComponent
        )
      );
    },

    onChange: function(tab) {
      this.setState({active: tab.key});
    }
  });

  module.exports.Table = React.createClass({
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

      var rows = module.exports.entriesRetriever.call(this, props.entries).map(function(entry) {
        var cells = props.cols.map(function(col) {
          var value = module.exports.valueRetriever.call(this, col, entry),
              className = col.className;
          if (typeof className === 'function') {
            className = className.call(self, value, col);
          }
          if (col.formatter) {
            value = col.formatter(value);
          }
          return React.DOM.td({className: className}, value);
        });
        var className = props.entryClass && props.entryClass.call(this, entry);
        return React.DOM.tr({className: className}, cells);
      });

      return React.DOM.table({className: common.mergeClassNames('ui table', props.className)},
        React.DOM.thead(undefined, cols),
        React.DOM.tbody(undefined, rows)
      );
    }
  });
}

module.exports = {

  mixins: {all: []},

  reset: init,

  totalPageRetriever: function() {
    return this.props.totalPages;
  },

  valueRetriever: function(column, entry) {
    return entry[column.key];
  },

  entriesRetriever: function(entries) {
    return entries;
  }
};

init();

})(resolver, module);
root["layout"] = module.exports;

return root;
})();
