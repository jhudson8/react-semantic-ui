RadioGroup
==========

Collection of radio items field that can display a label and optional field wrapper.  The item
data is retrieved in the same way that the [Dropdown](./Dropdown.md) component does.

Properties
----------
- ***options***: the available options list (by default can be array of strings, or array of {value, label})
- ***value***: the field value ("true" by default)
- ***name***: the field name

*other component attributes will be copied to the input field attributes*

*see additional properties from [Field Control](../form/Control.md)*

Overrides
---------
- ***classNames.RadioGroup***: class name to be added to all
- ***mixins.RadioGroup***: default mixins that should be applied
```valueAccessor```, ```optionsRetriever```

*see [overrides](./overrides.md)*

Example
--------
    var RadioGroup = rsui.input.RadioGroup;
    <RadioGroup label="Foo" defaultValue="abc" options={[{value: '1', label: 'One'}, {value: '2', label: 'Two'}]}/>