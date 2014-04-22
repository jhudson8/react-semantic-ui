overrides
=========

Overrides can be used to change how all input components work without having to override each individually.
The following are available

- ***valueAccessor***: function called with *this* as the owner component to retrieve the input field value
- ***optionsRetriever***: function called with *this* as the owner component  used to return all available options used for a list of components as ```[{value, label, selected}]```