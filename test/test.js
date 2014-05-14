var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    expect = chai.expect,
    React = require('react'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    $ = {
        options: [],
        ajax: function(options) {
          this.options.push(options);
        },
        success: function(data) {
          var options = this.options.pop();
          options.success && options.success(data);
        },
        error: function(error) {
          var options = this.options.pop();
          options.error && options.error(error);
        }
      };
chai.use(sinonChai);
Backbone.$ = $;
require('react-mixin-manager')(React);
global.rsui = require('../index')(React);
global.React = React;

var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    expect = chai.expect;
global.sinon = sinon;
global.expect = expect;

// intitialize mixin-dependencies
require('react-mixin-manager')(React);
// initialize backbone-async-event
require('backbone-async-event')(Backbone);
// add react-backbone mixins
require('../index')(React);

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
require('./spec/layout');
