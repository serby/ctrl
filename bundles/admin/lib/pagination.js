var url = require('url')


module.exports = function pagination(count, pageLength) {

  return function(req, res, next) {

    var urlObj = url.parse(req.url, true).query
      , options = {}


    if (typeof urlObj.Page === 'undefined') {
      urlObj.Page = 1
      options.skip = 0
      options.limit = pageLength
    } else if (urlObj.Page){
      options.skip = pageLength * (+urlObj.Page - 1)
      options.limit = pageLength
    }

    count(req.searchQuery, function(error, count) {
      var start = Math.max(urlObj.Page - 3, 1)
        , end = Math.min(start + 6, Math.ceil(count / pageLength))
        , firstPageResult = pageLength * (urlObj.Page - 1) + 1
        , lastPageResult = (pageLength * urlObj.Page < count) ? (pageLength * urlObj.Page) : count


      res.locals({ pagination:
          { collectionLength: count
          , pageLength: pageLength
          , page: urlObj.Page
          , start: Math.max(end - 6, 1)
          , end: end
          , lastPage: Math.ceil(count/pageLength)
          , firstPageResult: firstPageResult
          , lastPageResult: lastPageResult
          }
        }
      )

      req.searchOptions = options

      next()
    })

  }
}