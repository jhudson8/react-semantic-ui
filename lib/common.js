var React = require('react'),
    cache = {
      id: 0
    };

function concat() {
  var rtn = [];
  for (var i=0; i<arguments.length; i++) {
    var arg = arguments[i];
    if (Array.isArray(arg)) {
      rtn.concat.apply(rtn, arg);
    } else if (rtn) {
      rtn.push(arg);
    }
  }
  return rtn;
}

module.exports = {
  uniqueId: function() {
    return 'rsui-' + cache.id++;
  },

  omit: function(data, keys) {
    var rtn = {};
    for (var name in data) {
      if (keys.indexOf(name) === -1) {
        rtn[name] = data[name];
      }
    }
    return rtn;
  },

  mergeClassNames: function() {
    var rtn = '';
    for (var i=0; i<arguments.length; i++) {
      if (arguments[i]) {
        if (rtn.length > 0) rtn += ' ';
        rtn += arguments[i];
      }
    }
    return rtn;
  },

  eventBinder: function(value, type, context, cancelEvent) {
    return function(event) {
      if (cancelEvent) {
        event.stopPropagation();
        event.preventDefault();
      }
      context[type] && context[type](value, event);
      context.props[type] && context.props[type](value, event);
    };
  },

  result: function(value, context) {
    if (typeof value === 'function') {
      return value.call(context);
    } else {
      return value;
    }
  },

  init: function(_module, classData, options) {
    options = options || {};
    var exports = _module.exports,
        mixins = exports.mixins;
    if (!exports.mixins) {
      mixins = exports.mixins || {};
    }

    function _init() {
      for (var name in classData) {
        var data = classData[name];
        if (options.defaults) {
          for (var fName in options.defaults) {
            if (!data[fName]) {
              data[fName] = options.defaults[fName];
            }
          }
        }
        data.mixins = concat(data.mixins, mixins[name], mixins.all);
        exports[name] = React.createClass(data);
      }
    }

    exports.reset = _init;
    exports.classData = classData;
    _init();
  }
};
