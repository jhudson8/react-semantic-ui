API
===

The ```rsui.mixins``` namespace provides utility methods to deal with mixin dependency management and named mixin registration.

Functions
----------
- ***get(mixins...)***: each mixin can be a mixin object, an array of other mixins, or a string representing a registered mixin (see add function).
   Any mixins dependencies that were registered with a named mixin will be included first.
- ***add(name, mixin[, depends...]) register a named mixin
   - ***name***: the mixin name
   - ***mixin***: the mixin object
   - ***depends***: any number of string values representing a registered mixin to mark as a dependency to this mixin