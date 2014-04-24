Dropdown
========

Similar to the [Select](./Select.md) component but fancier.  See [examples](http://semantic-ui.com/modules/dropdown.html#/examples)
for more details on the actual semantic-ui component.

Properties
----------
- ***options***: the available options list (by default can be array of strings, or array of {value, label})
- ***value***: the field value ("true" by default)
- ***name***: the field name

*other component attributes will be copied to the input field attributes*

*see additional properties from [Field Control](../form/Control.md)*

Overrides
---------
- ***classNames.Dropdown***: class name to be added to all
- ***mixins.Dropdown***: default mixins that should be applied
```valueAccessor```, ```optionsRetriever```

*see [overrides](./overrides.md)*

Example
--------
    var RadioGroup = rsui.input.RadioGroup;
    <RadioGroup label="Foo" defaultValue="abc" options={[{value: '1', label: 'One'}, {value: '2', label: 'Two'}]}/>