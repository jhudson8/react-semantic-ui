Control
=======

Form field control meant to provide a label and additon field wrapper elements to
arbitrary nested content

Properties
----------
- ***id***: the id used for the label (for attribute)
- ***label***: the field label
- ***inlineLabel***: true if the label should be included as a sibling to the nested content
- ***labelAfter***: true if the inline label should be applied as the last sibling
- ***containerClass***: the inner container element class name
- ***className***: the outer field element class name
- ***disabled***: true if the field should render as disabled
- ***loading***: true if the field should render as loading

Overrides
---------
- ***fieldRenderer***: function which acts as the render method for this component
- ***classNames.Control***: class name to be added to all
- ***mixins.Control***: default mixins that should be applied

Example
--------
    var Control = rsui.form.Control;
    <Control label="Foo" error="some error message to display"> some input field </Control>