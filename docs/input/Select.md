Select
======

Standard select field that can display a label and optional field wrapper.
A [fancier control](./Dropdown.md) can be used as well.

Properties
----------
- ***options***: the available options list (by default can be array of strings, or array of {value, label})
- ***value***: the field value
- ***name***: the field name

*other component attributes will be copied to the input field attributes*

*see additional properties from [Field Control](../form/Control.md)*

Overrides
---------
- ***classNames.Select***: class name to be added to all
- ***mixins.Select***: default mixins that should be applied
```valueAccessor```, ```optionsRetriever```

*see [overrides](./overrides.md)*

Example
--------
     var Select = rsui.input.Select;
     <Select label="Foo" defaultValue="abc" options={[{value: '1', label: 'One'}, {value: '2', label: 'Two'}]}/>