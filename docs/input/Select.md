Select
======

Standard select field that can display a label and optional field wrapper.
A [fancier control](./Dropdown.md) can be used as well.

Properties
----------
- type: the input type ("text" by default)

Overrides
---------
- *Additional properties can be set defined by the [field Control](../form/Control.md)*
- valueAccessor: function used to retrieve the input field value
- errorRenderer: function(error, children) used to apply error message
- optionsRetriever: function(value) used to retrieve an array of available options [{value, label, selected}]