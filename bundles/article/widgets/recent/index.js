var _ = require('lodash')
  , widget = require('../../../../lib/widget-manager/widget-manager').widget
  , jade = require('../../../../lib/widget-manager/engines/jade')
  , fn = {
      recent: jade.compile(__dirname + '/recent.jade'),
      latest: jade.compile(__dirname + '/latest.jade')
    };
  ;

module.exports = function(serviceLocator) {
  var data = serviceLocator.app._locals;

  return widget({
    name: 'recent',
    namespace: 'article',
    render: function(layout) {
      if (!layout) {
        layout = 'recent';
      }
      return fn[layout](data);
    },
    load: function(req, res, next) {
      serviceLocator.articleModel.findWithUrl({},
        { limit: 5, sort: { publishedDate: -1} }, function(error, dataSet) {

        if (!error && dataSet.length() !== 0) {
          data = _.extend({}, data, {
            latestPost: dataSet.first(),
            recentPosts: dataSet.toArray()
          });
        }
        next();
      });
    }
  });
};