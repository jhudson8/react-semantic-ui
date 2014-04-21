var React = require('react'),
    common = require('./common');

function init() {
  module.exports.Loader = React.createClass({

    mixins: module.exports.LoadAwareMixins,

    render: function() {
      var props = this.props,
          loading = this.state && this.state.loading || props.loading;

      if (this.props.loading || this.state && this.state.loading) {
        var className = common.mergeClassNames('ui segment', props.className);
            loadingClass = common.mergeClassNames('ui active', props.type || 'inverted dimmer');
        return React.DOM.div({className: className},
                React.DOM.div({className: loadingClass},
                  React.DOM.div({className: 'ui loader' + (props.label ? ' text' : '')}, props.label)),
                this.props.children);
      }
    }
  });

  module.exports.Steps = React.createClass({
    getInitialState: function() {
      return {
        active: this.props.active || this.props.steps[0].key
      };
    },
    render: function() {
      var self = this,
          props = this.props,
          className = common.mergeClassNames('ui steps', props.type, props.className),
          activeStep = this.state.active,
          children = props.steps.map(function(step) {
            var className = common.mergeClassNames('ui step', step.key === activeStep ? 'active' : 'undefined', step.disabled ? 'disabled' : undefined);
            return React.DOM.div({className: className, onClick: self.clicker(step)}, step.label);
          });
      return React.DOM.div({className: className}, children);
    },
    clicker: function(step) {
      var self = this;
      return function() {
        if (!step.disabled) {
          var rtn = self.props.onChange && self.props.onChange(step);
          if (rtn === undefined || rtn) {
            self.setState({active: step.key});
          }
        }
      };
    }
  });

  module.exports.Paginator = React.createClass({
    getInitialState: function() {
      return {
        page: this.props.page || 1
      };
    },

    render: function() {
      var totalPages = module.exports.totalPageRetriever.call(this);
      if (totalPages && totalPages > 1) {
        var current = this.state.page,
            radius = this.props.radius || 1,
            anchor = this.props.anchor || 1,
            separator = this.props.separator || '...',
            min = Math.max(current - radius, 1),
            max = Math.min(current + radius, totalPages),
            showArrows = this.props.showArrows === undefined ? true : this.props.showArrows,
            totalShowing = (radius * 2) + 3 /* current + separator */ + (showArrows ? 2 : 0),
            showRightSeparator = (totalPages > current + radius + anchor),
            showLeftSeparator = (current  > (anchor + radius)),
            index = {},
            children = [];

        if (showLeftSeparator) {
          totalShowing--;
        }
        if (showRightSeparator) {
          totalShowing--;
        }

        // starting anchor
        for (var i=1; i<=anchor && i<=totalPages; i++) {
          children.push(i);
          index[i] = children.length;
        }

        // radius
        for (var i=min; i<=max; i++) {
          if (!index[i]) {
            children.push(i);
            index[i] = children.length;
          }
        }

        // upper anchor
        for (var i=totalPages-anchor+1; i<=totalPages; i++) {
          if (!index[i]) {
            children.push(i);
            index[i] = children.length;
          }
        }

        // always keep the same number of indicators showing - start down from middle
        for (var i=current; i > 0 && children.length < totalShowing; i--) {
          if (typeof index[i] === 'undefined') {
            _idx = index[i+1]-1;
            children.splice(_idx, 0, i);
            index[i] = _idx+1;
          }
        }
        for (var i=current; children.length < totalShowing && children.length < totalPages; i++) {
          if (!index[i]) {
            children.splice(i-1, 0, i);
          }
        }

        // map the children to components
        var self = this;
        children = children.map(function(child) {
          if (child === current) {
            return React.DOM.div({className: 'active item'}, child);
          } else {
            return React.DOM.a({className: 'item', href: '#' + child, onClick: common.eventBinder(child, 'onChange', self, true)}, child);
          }
        });

        // separators
        if (showLeftSeparator) {
          children.splice(anchor, 0, React.DOM.div({className: 'disabled item'}, separator));
        }
        if (showRightSeparator) {
          children.splice(children.length-anchor, 0, React.DOM.div({className: 'disabled item'}, separator));
        }

        // arrows
        if (showArrows) {
          var nodeName, className;
          if (current === 1) {
            nodeName = 'div';
            className = 'disabled item';
          } else {
            nodeName = 'a';
            className = 'item';
          }
          children.splice(0, 0, React.DOM[nodeName]({
            className: className, onClick: current > 1 ? common.eventBinder(current-1, 'onChange', self, true) : undefined
          }, React.DOM.i({className: 'left arrow icon'})));

          if (current === totalPages) {
            nodeName = 'div';
            className = 'disabled item';
          } else {
            nodeName = 'a';
            className = 'item';
          }
          children.splice(children.length, 0, React.DOM[nodeName]({
            className: className, onClick: current < totalPages ? common.eventBinder(current+1, 'onChange', self, true) : undefined
          }, React.DOM.i({className: 'right arrow icon'})));
        }

        return React.DOM.div({className: 'ui pagination menu'}, children);

      } else {
        return React.DOM.div();
      }
    },

    onChange: function(pageNumber) {
      this.setState({
        page: pageNumber
      });
    },

    setPage: function(pageNumber) {
      this.setState({
        page: pageNumber
      });
    }
  });

  module.exports.Menu = React.createClass({
    getInitialState: function() {
      return {
        active: this.props.active || this.props.items[0].key
      };
    },
    render: function() {
      var self = this,
          props = this.props,
          items = props.items,
          activeKey = this.state.active,
          active;
      for (var i=0; i<props.items.length; i++) {
        if (activeKey === props.items[i].key) {
          active = props.items[i];
          break;
        }
      }
      var children = items.map(function(item) {
        return React.DOM.a({className: common.mergeClassNames((item.key === activeKey) && 'active', 'item', item.className), href: item.key,
            onClick: common.eventBinder(item, 'onChange', self, true)}, item.label);
      });

      return React.DOM.div({className: common.mergeClassNames('ui menu', props.className)},
        children,
        props.children
      );
    },
    onChange: function(item) {
      this.setState({active: item.key});
      item.activate && item.activate();
    }
  });

  module.exports.Tabs = React.createClass({
    getInitialState: function() {
      return {
        active: this.props.active || this.props.tabs[0].key
      };
    },
    render: function() {
      var self = this,
          props = this.props,
          tabs = props.tabs,
          activeKey = this.state.active,
          active;
      for (var i=0; i<props.tabs.length; i++) {
        if (activeKey === props.tabs[i].key) {
          active = props.tabs[i];
          break;
        }
      }

      var tabLabels = tabs.map(function(tab) {
        return React.DOM.a({className: common.mergeClassNames((tab.key === activeKey) && 'active', 'item', tab.className), href: tab.key,
            onClick: common.eventBinder(tab, 'onChange', self, true)}, tab.label);
      });
      var pageComponent = active.page();

      return React.DOM.div({className: props.className},
        React.DOM.div({className: 'ui top attached tabular menu'},
          tabLabels
        ),
        React.DOM.div({className: 'ui bottom attached segment'},
          pageComponent
        )
      );
    },

    onChange: function(tab) {
      this.setState({active: tab.key});
    }
  });

  module.exports.Table = React.createClass({
    render: function() {
      var self = this,
          props = this.props;
      var cols = props.cols.map(function(col) {
        var label = common.result(col.label),
            className = col.colClass;
        if (typeof className === 'function') {
          className = className.call(self, value, col);
        }
        return React.DOM.th({className: className}, label);
      });

      var rows = module.exports.entriesRetriever.call(this, props.entries).map(function(entry) {
        var cells = props.cols.map(function(col) {
          var value = module.exports.valueRetriever.call(this, col, entry),
              className = col.className;
          if (typeof className === 'function') {
            className = className.call(self, value, col);
          }
          if (col.formatter) {
            value = col.formatter(value);
          }
          return React.DOM.td({className: className}, value);
        });
        var className = props.entryClass && props.entryClass.call(this, entry);
        return React.DOM.tr({className: className}, cells);
      });

      return React.DOM.table({className: common.mergeClassNames('ui table', props.className)},
        React.DOM.thead(undefined, cols),
        React.DOM.tbody(undefined, rows)
      );
    }
  });
}

module.exports = {
  reset: init,

  totalPageRetriever: function() {
    return this.props.totalPages;
  },

  valueRetriever: function(column, entry) {
    return entry[column.key];
  },

  entriesRetriever: function(entries) {
    return entries;
  }
};

init();
