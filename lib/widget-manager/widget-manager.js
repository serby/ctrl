var async = require('async');

module.exports.createWidgetManager = function(serviceLocator) {
  var widgets = Object.create(null)
    , self = {
    register: function(widget) {
      if (widgets[widget.fullName] !== undefined) {
        throw new Error('Widget \'' + widget.fullName + '\' already registered');
      }

      if (typeof widgets[widget.fullName] === 'object') {
        throw new Error('Expecting Widget object');
      }
      serviceLocator.logger.info('Registering Widget: ' + widget.fullName);
      widgets[widget.fullName] = widget;
      return self;
    },
    load: function(names) {
      if (!Array.isArray(names)) {
        names = [names];
      }

      return function (req, res, next) {
        async.forEach(names, function(name, done) {
          widgets[name].load(req, res, function() {
            widgets[name].loaded = true;
            done();
          });
        }, next);
      };
    },
    render: function(fullName, layout) {
      if (widgets[fullName] === undefined) {
        throw new Error('No Widget registered:' + fullName + '\n' + Object.keys(widgets).join(','));
      }
      var renderedWidget = widgets[fullName].loaded ? widgets[fullName].render(layout) : '';
      widgets[fullName].loaded = false;
      return renderedWidget;
    }
  };

  return self;
};

module.exports.widget = function(widget) {
  if (widget.name === undefined) {
    throw new Error('Widget must have a name');
  }
  if (widget.namespace === undefined) {
    throw new Error('Widget must have a namespace');
  }
  if (typeof widget.render !== 'function') {
    throw new Error('Widget must have a render function');
  }
  if (typeof widget.load !== 'function') {
    throw new Error('Widget must have a load function');
  }
  Object.defineProperty(widget, 'fullName', { value: widget.namespace + '::' + widget.name });
  return widget;
};