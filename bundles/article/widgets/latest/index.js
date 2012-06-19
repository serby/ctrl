var _ = require('underscore')
  , widget = require('../../../../lib/widget-manager/widget-manager').widget
  , jade = require('../../../../lib/widget-manager/engines/jade')
  , fn = jade.compile(__dirname + '/latest.jade')
  ;

module.exports = function(serviceLocator) {
  var data = serviceLocator.app._locals;

  return widget({
    name: 'latest',
    namespace: 'article',
    render: function() {
      return fn(data);
    },
    load: function(req, res, next) {
      serviceLocator.articleModel.findWithUrl({},
        { limit: 1, sort: { publishedDate: -1} }, function(error, dataSet) {

        if (!error && dataSet.length() !== 0) {
          data = _.extend({}, data, {
            latestPost: dataSet.first()
          });
        }
        next();
      });
    }
  });
};