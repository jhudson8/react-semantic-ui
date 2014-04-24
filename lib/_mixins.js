var dependsOn = {},
    mixins = {};
/*** API
 * The ```rsui.mixins``` namespace provides utility methods to deal with mixin dependency management and named mixin registration.
 *
 * Functions
 * ----------
 * - ***get(mixins...)***: each mixin can be a mixin object, an array of other mixins, or a string representing a registered mixin (see add function).
 *    Any mixins dependencies that were registered with a named mixin will be included first.
 * - ***add(name, mixin[, depends...]) register a named mixin
 *    - ***name***: the mixin name
 *    - ***mixin***: the mixin object
 *    - ***depends***: any number of string values representing a registered mixin to mark as a dependency to this mixin
 ***/
function get(values, index, rtn) {
  function addTo(name) {
    if (!index[name]) {
      var mixin = mixins[name];
      if (mixin) {
        var depends = dependsOn[name];
        if (depends) {
          for (var i=0; i<depends.length; i++) {
            addTo(depends[i]);
          }
        }
        rtn.push(mixin);
        index[name] = true;
      } else {
        throw "invalid mixin '" + name + "'";
      }
    }
  }

  for (var i=0; i<values.length; i++) {
    var mixin = values[i];
    if (mixin) {
      if (Array.isArray(mixin)) {
        get(mixin, index, rtn);
      } else if (typeof mixin === 'string') {
        addTo(mixin);
      } else {
        rtn.push(mixin);
      }
    }
  }
}

module.exports = {

  get: function() {
    var rtn = [],
        index = {};
    get(Array.prototype.slice.call(arguments), index, rtn);
    return rtn;
  },

  add: function(name, mixin) {
    var depends = Array.prototype.slice.call(arguments, 2);
    dependsOn[name] = depends.length && depends;
    mixins[name] = mixin;
  }
};
