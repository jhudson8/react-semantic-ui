Checkbox
========

Standard checkbox field that can display a label and optional field wrapper.

Properties
----------
- ***defaultChecked*** true if the field should be checked in it's initial state
- ***value***: the field value ("true" by default)
- ***name***: the field name

*other component attributes will be copied to the input field attributes*

*see additional properties from [Field Control](../form/Control.md)*

Overrides
---------
- ***classNames.Checkbox***: class name to be added to all
- ***mixins.Checkbox***: default mixins that should be applied
```valueAccessor```

*see [overrides](./overrides.md)*

Example
--------
    var Checkbox = rsui.input.Checkbox;
    <Checkbox label="Foo" defaultChecked={true} defaultValue="abc"/>