var React = require('react'),
    common = require('./common'),
    form = require('./form');

module.exports = {
  mixins: {},

  valueAccessor: function() {
    return this.state && this.state.value || this.props.value;
  },

  errorRenderer: function(error, children) {
    children.push(React.DOM.div({className: 'ui red pointing top ui label'}, error));
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
var signatures = module.exports.signatures;

function getValue(obj) {
  return module.exports.valueAccessor.call(obj);
}

var classData = {

  /*** Text
   * Standard text field that can display a label and optional field wrapper
   *
   * Properties
   * ----------
   * - type: the input type ("text" by default)
   *
   * Overrides
   * ---------
   * - *Additional properties can be set defined by the [field Control](../form/Control.md)*
   * - valueAccessor: function used to retrieve the input field value
   * - errorRenderer: function(error, children) function used to apply error message
   ***/
  Text: {
    renderInput: function(props) {
      props.type = props.type || 'text';
      props.defaultValue = getValue(this);
      return React.DOM.input(props);
    }
  },

  /*** Select
   * Standard select field that can display a label and optional field wrapper.
   * A [fancier control](./Dropdown.md) can be used as well.
   *
   * Properties
   * ----------
   * - type: the input type ("text" by default)
   *
   * Overrides
   * ---------
   * - *Additional properties can be set defined by the [field Control](../form/Control.md)*
   * - valueAccessor: function used to retrieve the input field value
   * - errorRenderer: function(error, children) used to apply error message
   * - optionsRetriever: function(value) used to retrieve an array of available options [{value, label, selected}]
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

  Checkbox: {
    defaultLabelAfter: true,
    defaultInlineLabel: true,
    defaultContainerClass: function() {
      return common.mergeClassNames('ui checkbox', this.props.type);
    },
    renderInput: function(props) {
      props.defaultChecked = getValue(this);
      props.defaultValue = 'true';
      props.type = 'checkbox';
      return React.DOM.input(props);
    }
  },

  Radio: {
    defaultLabelAfter: true,
    defaultInlineLabel: true,
    defaultContainerClass: function() {
      return common.mergeClassNames('ui radio checkbox', this.props.type);
    },
    renderInput: function(props) {
      props.type = 'radio';
      props.value = getValue(this);
      return React.DOM.input(props);
    }
  },

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
    }
  }
};

common.init(module, classData, {
  defaultRender: form.fieldRenderer
});
