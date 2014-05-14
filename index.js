function lib(React) {
  var common = require('./lib/common')(React),
      form = require('./lib/form')(React, common);
  return {
    form: form,
    input: require('./lib/input')(React, form, common),
    layout: require('./lib/layout')(React, common)
  };
}

if (global.React) {
  global.rsui = lib(global.React);
} else {
  module.exports = lib;
}