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
