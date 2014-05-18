module.exports = function(React, common) {
  var exports = {
    totalPageRetriever: function() {
      return this.props.totalPages;
    },

    valueRetriever: function(column, entry) {
      if (entry.get) {
        return entry.get(column.key);
      }
      return entry[column.key];
    },

    keyRetriever: function(entry) {
      return entry.id || entry.key;
    },

    entriesRetriever: function(entries) {
      if (entries.models) {
        return entries.models;
      }
      return entries;
    }
  };
  
  var classData = {

    Loader: {
      render: function() {
        var props = this.props,
            loading = this.state && this.state.loading || props.loading;

        if (this.props.loading || this.state && this.state.loading) {
          var className = common.mergeClassNames('ui', 'segment', props.className);
              loadingClass = common.mergeClassNames('ui active', props.type || 'inverted dimmer');
          return React.DOM.div({className: className},
                  React.DOM.div({className: loadingClass},
                    React.DOM.div({className: 'ui loader' + (props.label ? ' text' : '')}, props.label)),
                  this.props.children);
        } else {
          return React.DOM.div({className: props.className}, this.props.children);
        }
      }
    },


    Steps: {
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
              var className = common.mergeClassNames('ui step', step.key === activeStep ? 'active' : undefined, step.disabled ? 'disabled' : undefined);
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
    },


    /*** Paginator
     * A paginator component.
     *
     * Properties
     * ----------
     * - ***totalPages***: the number of total pages
     * - ***className***: additional top level class name
     * - ***page***: (default: 1) the current page number (1-based)
     * - ***radius***: (default: 1) the number of page links (moving out from current page) to show
     * - ***anchor***: (default: 1) the number of page links (moving out from each end) to show
     * - ***onChange***: called when the user clicked a page number
     *
     * Example
     * ---------
     *     <Paginator page={2} totalPages={12} onChange={funtion(pageNumber) {...}}/>
     ***/
    Paginator: {
      getInitialState: function() {
        return {
          page: this.props.page || 1
        };
      },

      render: function() {
        var totalPages = exports.totalPageRetriever.call(this);
        if (totalPages && totalPages > 1) {
          var current = this.state.page,
              radius = this.props.radius || 0,
              anchor = this.props.anchor || 1,
              separator = this.props.separator || '...',
              min = Math.max(current - radius, 1),
              max = Math.min(current + radius, totalPages),
              showArrows = this.props.showArrows === undefined ? true : this.props.showArrows,
              totalShowing = (radius * 2) + (anchor * 2) + 3 /* current + separator */,
              showRightSeparator = (totalPages > current + radius + anchor),
              showLeftSeparator = (current  > (anchor + Math.max(1, radius))),
              compact = this.props.compact,
              index = {},
              children = [];
          if (compact) {
            showArrows = false;
          }

          if (showLeftSeparator) {
            totalShowing--;
          }
          if (showRightSeparator) {
            totalShowing--;
          }

          var i;
          // starting anchor
          for (i=1; i<=anchor && i<=totalPages; i++) {
            children.push(i);
            index[i] = children.length;
          }

          // radius
          for (i=min; i<=max; i++) {
            if (!index[i]) {
              children.push(i);
              index[i] = children.length;
            }
          }

          // upper anchor
          for (i=Math.max(totalPages-anchor+1, current+1); i<=totalPages; i++) {
            if (!index[i]) {
              children.push(i);
              index[i] = children.length;
            }
          }

          // always keep the same number of indicators showing - start down from middle
          for (i=current; i > 0 && children.length < totalShowing; i--) {
            if (typeof index[i] === 'undefined') {
              _idx = index[i+1]-1;
              children.splice(_idx, 0, i);
              index[i] = _idx+1;
            }
          }
          for (i=current; children.length < totalShowing && children.length < totalPages; i++) {
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
            if (compact) {
              children.splice(anchor, 0, React.DOM.a({className: 'icon item'}, React.DOM.i({className: 'left arrow icon', onClick: common.eventBinder(current-1, 'onChange', self, true)})));
            } else {
              children.splice(anchor, 0, React.DOM.div({className: 'disabled item'}, separator));
            }
          }
          if (showRightSeparator) {
            if (compact) {
              children.splice(children.length-anchor, 0, React.DOM.a({className: 'icon item'}, React.DOM.i({className: 'right arrow icon', onClick: common.eventBinder(current+1, 'onChange', self, true)})));
            } else {
              children.splice(children.length-anchor, 0, React.DOM.div({className: 'disabled item'}, separator));
            }
          }

          // arrows
          if (showArrows) {
            var nodeName, className;
            if (current === 1) {
              nodeName = 'div';
              className = 'icon disabled item';
            } else {
              nodeName = 'a';
              className = 'icon item';
            }
            children.splice(0, 0, React.DOM[nodeName]({
              className: className, onClick: current > 1 ? common.eventBinder(current-1, 'onChange', self, true) : undefined
            }, React.DOM.i({className: 'left arrow icon'})));

            if (current === totalPages) {
              nodeName = 'div';
              className = 'icon disabled item';
            } else {
              nodeName = 'a';
              className = 'icon item';
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
    },


    Menu: {
      getInitialState: function() {
        return {
          active: this.props.active || this.props.items[0].key
        };
      },
      render: function() {
        var self = this,
            props = this.props,
            items = props.items || [],
            activeKey = this.state.active,
            active;
        for (var i=0; i<items; i++) {
          if (activeKey === items[i].key) {
            active = items[i];
            break;
          }
        }
        var children = items.map(function(item) {
          return React.DOM.a({className: common.mergeClassNames((item.key === activeKey) && 'active', 'item', item.className), href: item.href || item.key,
              onClick: item.href ? props.onClick : common.eventBinder(item, 'onChange', self, true)}, item.icon ? React.DOM.i({className: item.icon + ' icon'}) : undefined, item.label);
        });

        return React.DOM.div({className: common.mergeClassNames('ui menu', props.className)},
          children,
          props.children
        );
      },
      onChange: function(item) {
        this.setState({active: item.key});
        if (item.activate) {
          item.activate();
        }
      },
      setActive: function(key) {
        this.setState({active: key});
      }
    },


    Tabs: {
      getInitialState: function() {
        return {
          active: this.props.active || this.props.tabs[0].key
        };
      },
      render: function() {
        var self = this,
            props = this.props,
            tabs = props.tabs || [],
            type = props.type || 'top attached tabular',
            bodyType = props.bodyType || 'bottom attached segment',
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
              onClick: common.eventBinder(tab, 'onChange', self, true)}, tab.icon ? React.DOM.i({className: tab.icon + ' icon'}) : undefined, tab.label);
        });
        var pageComponent = active.page();

        return React.DOM.div({className: props.className},
          React.DOM.div({className: 'ui ' + type + ' menu'},
            tabLabels
          ),
          React.DOM.div({className: 'ui ' + bodyType},
            pageComponent
          )
        );
      },

      onChange: function(tab) {
        this.setState({active: tab.key});
      }
    },


    Table: {
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

        var index = 0,
            rows = exports.entriesRetriever.call(this, props.entries).map(function(entry) {
              var cells = props.cols.map(function(col) {
                var value = exports.valueRetriever.call(this, col, entry),
                    cellClassName = col.cellClassName;
                if (typeof cellClassName === 'function') {
                  cellClassName = cellClassName.call(self, value, col);
                }
                index++;
                if (col.formatter) {
                  value = col.formatter.call(this, value, entry, index, col);
                }
                if (col.factory) {
                  value = col.factory.call(this, value, entry, index, col);
                }
                return React.DOM.td({className: cellClassName, key: col.key}, value);
              });
              var className = props.rowClassName && props.rowClassName.call(this, entry);
              return React.DOM.tr({className: className, key: exports.keyRetriever(entry)}, cells);
            });

        return React.DOM.table({className: common.mergeClassNames('ui table', props.className)},
          React.DOM.thead(undefined, cols),
          React.DOM.tbody(undefined, rows)
        );
      }
    }
  };

  common.init(exports, classData);

  return exports;
};
