var url = require('url')


module.exports = function(searchProperties, logger, serviceName) {

  return function buildSearchQuery(req, res, next) {
    var urlObj = url.parse(req.url, true).query
      , query = {}
      , queryItem = {}
      , queryFields = []
      , filter = urlObj.Filter
      , regExpSearchTerm


    if (Object.keys(searchProperties).length === 0) {
      logger.warn('No search fields set up for ' + serviceName)
    }

    if (filter) {
      Object.keys(searchProperties).forEach(function(type) {
        queryItem = {}
        switch (searchProperties[type]) {
          case 'number':
            if(!isNaN(+filter)) {
              queryItem[type] = +filter
              queryFields.push(queryItem)
            }
            break
          case 'text':
            regExpSearchTerm = new RegExp(filter, 'i')
            queryItem[type] = regExpSearchTerm
            queryFields.push(queryItem)
            break
        }
      })

      query = { $or: queryFields }
    }

    if (Object.keys(query).length > 0) {
      logger.info(serviceName, 'search query: ', query)
    }

    req.searchQuery = query

    next()
  }
}

/**
* Creates an object of the searchable fields in the schema. Used by the mongo query builder later on.
* Iterates through each group and the properties of that group to get the searchType if present
*/
module.exports.createSearchProperties = function(viewSchemaGroups) {
  var searchProperties = {}

  Object.keys(viewSchemaGroups).forEach(function(group) {
    Object.keys(viewSchemaGroups[group].properties).forEach(function(property) {
      if (viewSchemaGroups[group].properties[property].searchType) {
        searchProperties[property] = viewSchemaGroups[group].properties[property].searchType
      }
    })
  })
  return searchProperties
}