var async = require('async')

module.exports = function createAdminFormMiddleware(serviceLocator) {
  return function adminFormMiddleware(req, res, next) {

    res.locals({typesDropdown: ['Markdown', 'HTML']})
    res.locals({currentAdmin: {
      author: req.session.admin.firstName + ' ' + req.session.admin.lastName
    }})

    async.parallel({
      sections: function(callback) {
        serviceLocator.sectionModel.find({}, {}, function(error, sections) {
          var sectionsDropdownObject = {}
          sectionsDropdownObject[''] = ''
          sections.forEach(function(section) {
            sectionsDropdownObject[section.name] = section.slug
          })
          res.locals({ sectionsDropdown: sectionsDropdownObject })
          callback()
        })
      },
      authors: function(callback) {
        serviceLocator.administratorModel.find({}, { sort: { lastName: 1 } },
          function(error, admins) {

          var adminsDropdown = []
          adminsDropdown.push('')
          admins.forEach(function(admin) {
            adminsDropdown.push(admin.firstName + ' ' + admin.lastName)
          })
          res.locals({ adminsDropdown: adminsDropdown })
          callback()
        })
      }
    }, function() {
      next()
    })
  }
}