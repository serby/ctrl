var url = require('url')

module.exports = function buildOptions(req, res, next) {
  var urlObj = url.parse(req.url, true).query
    , options = {}
    , sortProperty = urlObj.Sort
    , direction = urlObj.Direction


  if (sortProperty && direction) {
    options.sort = {}
    switch (direction) {
      case 'asc':
        options.sort[sortProperty] = 1
        break
      case 'desc':
        options.sort[sortProperty] = -1
        break
    }
  }

  req.options = options

  next()
}