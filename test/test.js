var window = global.window = require('domino').createWindow('<div id="test"></div>');
var document = global.document = window.document;
global.navigator = { userAgent: "node-js" };

global.expect = require("chai").expect;
global.React = require("react");
global.utils = undefined;
React.addons = require("react-addons");
global.TestUtils = React.addons.TestUtils;


global.normalizeReact = function(component) {
  var body = typeof component === 'string' ? component : React.renderComponentToString(component);
  return body.replace(/\s*data-reactid="[^"]*"/g, '')
      .replace(/\s*data-react-checksum="[^"]*"/g, '')
      .replace(/"rsui-\d*"/g, '"*"');
};

function getClassNames(component) {
  var domString = typeof component === 'string' ? component : React.renderComponentToString(component);
  var match = domString.match(/class\s*=\s*"([^"]*)"/g);
  return match && match[0].replace(/class\s*=\s*"/, '').split(' ') || [];
}

global.hasClass = function(classNames, component) {
  classNames = typeof classNames === 'string' ? [classNames] : classNames;
  var classes = getClassNames(component);
  for (var i=0; i<classNames; i++) {
    if (classes.indexOf(classNames[i]) === -1) {
      return false;
    }
  }
  return true;
};

global.noClass = function(classNames, component) {
  classNames = typeof classNames === 'string' ? [classNames] : classNames;
  var classes = getClassNames(component);
  for (var i=0; i<classNames; i++) {
    if (classes.indexOf(classNames[i]) === -1) {
      return false;
    }
  }
  return true;
};

require('./spec/form');
require('./spec/input');
