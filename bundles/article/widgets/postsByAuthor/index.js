var _ = require('lodash')
  , widget = require('../../../../lib/widget-manager/widget-manager').widget
  , jade = require('../../../../lib/widget-manager/engines/jade')
  , fn = jade.compile(__dirname + '/postsByAuthor.jade')
  ;

module.exports = function(serviceLocator) {
  var data = serviceLocator.app._locals;

  return widget({
    name: 'postsByAuthor',
    namespace: 'article',
    render: function() {
      return fn(data);
    },
    load: function(req, res, next) {
      var searchQuery = {
        author: res.article[0].author,
        title: {
          $ne: res.article[0].title
        }
      };
      serviceLocator.articleModel.findWithUrl(searchQuery,
        { limit: 5, sort: { publishedDate: -1 } }, function(error, dataSet) {

        data.authorPosts = dataSet.toArray();
        data.author = res.article[0].author;
        next();
      });
    }
  });
};