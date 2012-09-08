var url = require('url')
  , _ = require('lodash')
  , qs = require('querystring')
  ;

module.exports.createPagination = function(count, pageLength) {

  return function(req, res, next) {

    var urlObj = url.parse(req.url, true).query
      , options = {}
      ;

    if (typeof urlObj.Page === 'undefined') {
      urlObj.Page = 1;
      options.skip = 0;
      options.limit = pageLength;
    } else if (urlObj.Page){
      options.skip = pageLength * (+urlObj.Page - 1);
      options.limit = pageLength;
    }

    count(req.searchQuery, function(error, count) {
      var start = Math.max(urlObj.Page - 3, 1)
        , end = Math.min(start + 6, Math.ceil(count / pageLength))
        ;

      res.local('pagination',
        { collectionLength: count
        , pageLength: pageLength
        , page: urlObj.Page
        , start: Math.max(end - 6, 1)
        , end: end
        , lastPage: Math.ceil(count/pageLength)
        }
      );

      req.searchOptions = options;

      next();
    });

  };
};

module.exports.helpers = {
  getPage: function(urlObj, page) {
    var querystring = _.extend({}, urlObj);
    querystring.Page = page;
    return this.stringify(querystring);
  },
  getFirst: function(urlObj) {
    var querystring = _.extend({}, urlObj);
    querystring.Page = 1;
    return this.stringify(querystring);
  },
  getNext: function(urlObj) {
    var querystring = _.extend({}, urlObj);
    querystring.Page = !querystring.Page ? querystring.Page = 2 : querystring.Page = +querystring.Page + 1;
    return this.stringify(querystring);
  },
  getPrevious: function(urlObj) {
    var querystring = _.extend({}, urlObj);
    querystring.Page = querystring.Page - 1;
    return this.stringify(querystring);
  },
  getLast: function(urlObj, lastPage) {
    var querystring = _.extend({}, urlObj);
    querystring.Page = lastPage;
    return this.stringify(querystring);
  },
  getSort: function(urlObj, key) {
    var querystring = _.extend({}, urlObj)
      , direction = 'asc'
      ;

    if (typeof querystring.Sort !== 'undefined' && typeof querystring.Direction !== 'undefined' && querystring.Sort === key) {
      if (querystring.Direction === 'asc') {
        direction = 'desc';
      }
    }

    querystring.Sort = key;
    querystring.Direction = direction;

    return this.stringify(querystring);
  },
  stringify: function(querystring) {
    return '?' + qs.stringify(querystring);
  }
};