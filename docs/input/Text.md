Text
====

Standard text field that can display a label and optional field wrapper

Properties
----------
- ***type***: the input type ("text" by default)
- ***value***: the field value
- ***name***: the field name

*other component attributes will be copied to the input field attributes*

*see additional properties from [Field Control](../form/Control.md)*

Overrides
---------
- ***classNames.Text***: class name to be added to all
- ***mixins.Text***: default mixins that should be applied
```valueAccessor```

*see [overrides](./overrides.md)*

Example
--------
    var Text = rsui.input.Text;
    <Text label="Foo" value="bar"> ... </Text>