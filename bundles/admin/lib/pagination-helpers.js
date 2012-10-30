var qs = require('querystring')
  , _ = require('lodash')


module.exports = {
  getPage: function(urlObj, page) {
    var querystring = _.extend({}, urlObj)
    querystring.Page = page
    return this.stringify(querystring)
  },
  getFirst: function(urlObj) {
    var querystring = _.extend({}, urlObj)
    querystring.Page = 1
    return this.stringify(querystring)
  },
  getNext: function(urlObj) {
    var querystring = _.extend({}, urlObj)
    querystring.Page = !querystring.Page ? querystring.Page = 2 : querystring.Page = +querystring.Page + 1
    return this.stringify(querystring)
  },
  getPrevious: function(urlObj) {
    var querystring = _.extend({}, urlObj)
    querystring.Page = querystring.Page - 1
    return this.stringify(querystring)
  },
  getLast: function(urlObj, lastPage) {
    var querystring = _.extend({}, urlObj)
    querystring.Page = lastPage
    return this.stringify(querystring)
  },
  getSort: function(urlObj, key) {
    var querystring = _.extend({}, urlObj)
      , direction = 'asc'


    if (typeof querystring.Sort !== 'undefined' &&
      typeof querystring.Direction !== 'undefined' && querystring.Sort === key) {

      if (querystring.Direction === 'asc') {
        direction = 'desc'
      }
    }

    querystring.Sort = key
    querystring.Direction = direction

    return this.stringify(querystring)
  },
  stringify: function(querystring) {
    return '?' + qs.stringify(querystring)
  }
}