var cache = { id: 0 },
    reactBackboneAware = !!React.mixins.exists('modelFieldValidator');

module.exports = function(React) {
  return {
    uniqueId: function() {
      return 'rsui-' + cache.id++;
    },

    defaults: function() {
      var base = arguments[0],
          current;
      for (var i=1; i<arguments.length; i++) {
        current = arguments[i];
        for (var name in current) {
          if (base[name] === undefined) {
            base[name] = current[name];
          }
        }
      }
      return base;
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
      return rtn && rtn;
    },

    eventBinder: function(value, type, context, cancelEvent) {
      return function(event) {
        if (cancelEvent) {
          event.stopPropagation();
          event.preventDefault();
        }
        if (context[type]) {
          context[type](value, event);
        }
        if (context.props[type]) {
          context.props[type](value, event);
        }
      };
    },

    result: function(value, context) {
      if (typeof value === 'function') {
        return value.call(context);
      } else {
        return value;
      }
    },

    init: function(exports, classData, options) {
      options = options || {};

      // allow for special setup if https://github.com/jhudson8/react-backbone is installed
      if (reactBackboneAware && options.ifReactBackbone) {
        options.ifReactBackbone(options);
      }

      var _mixins = exports.mixins;
      if (!exports.mixins) {
        _mixins = exports.mixins || {all: []};
      }

      function _init() {
        for (var name in classData) {
          var data = classData[name],
              spec = {};
          for (var _name in data) {
            spec[_name] = data[_name];
          }
          if (options.defaults) {
            for (var fName in options.defaults) {
              if (!spec[fName]) {
                spec[fName] = options.defaults[fName];
              }
            }
          }
          options.mixins = options.mixins || {};
          spec.mixins = [spec.mixins, _mixins[name], _mixins.all, options.mixins[name], options.mixins.all];
          exports[name] = React.createClass(spec);
        }
      }

      exports.reset = _init;
      exports.classData = classData;
      _init();
    }
  };
};
