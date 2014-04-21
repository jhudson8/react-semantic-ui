Button
======

A standard input button which reacts to a loading state

Properties
----------
- icon: the [icon name](http://semantic-ui.com/elements/icon.html)
- className: additional button class name ("ui button" will already be applied)
- disabled: true if the button should be disabled
- loading: true if the button is in a loading state

Overrides
---------
- signatures.Button: the default button class ("ui button")
- mixins.Button: default mixins that should be applied to the button
- applyIcon: function({children, className, disabled, icon});
apply the icon and update any data for rendering
- applyLoadingState: function({children, className, disabled, icon});
apply a loading state and update any data for rendering