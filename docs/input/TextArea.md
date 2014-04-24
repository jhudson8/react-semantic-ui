TextArea
========

Standard textarea field that can display a label and optional field wrapper

Properties
----------
- ***value***: the field value
- ***name***: the field name

*other component attributes will be copied to the input field attributes*

*see additional properties from [Field Control](../form/Control.md)*

Overrides
---------
- ***mixins.Text***: default mixins that should be applied
```valueAccessor```

*see [overrides](./overrides.md)*

Example
--------
    var Text = rsui.input.Text;
    <TextArea label="Foo" defaultValue="bar"> ... </TextArea>