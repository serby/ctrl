var _ = require('lodash')
  , widget = require('../../../../lib/widget-manager/widget-manager').widget
  , jade = require('../../../../lib/widget-manager/engines/jade')
  , fn = jade.compile(__dirname + '/categories.jade')
  ;

module.exports = function(serviceLocator) {
  var data = serviceLocator.app._locals;

  return widget({
    name: 'categories',
    namespace: 'article',
    render: function() {
      return fn(data);
    },
    load: function(req, res, next) {
      serviceLocator.sectionModel.find({}, { sort: { name: 1 } }, function(error, dataSet) {
        data.sections = dataSet;
        next();
      });
    }
  });
};