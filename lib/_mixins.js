var dependsOn = {},
    mixins = {};

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

  add: function(name, mixin, depends) {
    var depends = Array.prototype.slice.call(arguments, 2);
    dependsOn[name] = depends.length && depends;
    mixins[name] = mixin;
  }
};
