var _ = require('lodash')
  , async = require('async')
  , url = require('url')
  , searchQuery = require('./search-query')
  , sortOptions = require('./sort-options')
  , pagination = require('./pagination')
  , join = require('path').join

module.exports = function routes(serviceLocator, schema, model, options) {

  var defaults =
    { createValidationSet: ''
    , updateValidationSet: ''
    , createTag: undefined
    , updateTag: undefined
    , requiredAccess: model.slug
    , scripts: {}
    , renderFn: null
    , adminRoute: '/admin/'
    },
  views =
    { form: join(__dirname, '/../views/generic/form')
    , list: join(__dirname, '/../views/generic/list')
    , view: join(__dirname, '/../views/generic/view')
    }
  , emptyMiddleware = function (req, res, next) {
      next()
    }
  , middleware =
    { create: emptyMiddleware
    , read: emptyMiddleware
    , update: emptyMiddleware
    , delete: emptyMiddleware
    , list: emptyMiddleware
    }

  options = _.extend({}, defaults, options)
  _.extend(views, options.views)
  _.extend(middleware, options.middleware)

  /*
   * Adds the common JavaScript
   * required for admin section
   */
  function compactMiddleware(view) {
    if (options.scripts[view]) {
      return serviceLocator.compact.js(
        ['global'], ['admin'],
        options.scripts[view]
      )
    } else {
      return serviceLocator.compact.js(['global'], ['admin'])
    }
  }

  /*
   * Returns an access checking middleware
   * based on the required access and the action.
   */
  function accessCheck(action) {
    return serviceLocator.adminAccessControl.requiredAccess(
      options.requiredAccess,
      action,
      options.adminRoute + 'login'
    )
  }

  /**
  * This ensures errors with properties that are not displayed on the form are shown
  */
  function listUnshownErrors(errors, formType) {

    return Object.keys(errors).filter(function(property) {
      for (var i = 0; i < schema.groups.length; i++) {
        if ((schema.groups[i].properties[property] === undefined) || (!schema.groups[i].properties[property][formType])) {
          return true
        }
      }
      return false
    })
  }

  var searchProperties = searchQuery.createSearchProperties(schema.groups)
    , buildSearchQuery = searchQuery(
        searchProperties,
        serviceLocator.logger,
        model.name
      )
    , paginate = pagination(model.count, 10)

  serviceLocator.router.get(
    options.adminRoute + model.slug,
    compactMiddleware('view'),
    buildSearchQuery,
    sortOptions,
    paginate,
    accessCheck('read'),
    middleware.list,
    function (req, res) {
      model.find(
        req.searchQuery,
        _.extend(req.options, req.searchOptions),
        function (errors, dataSet) {
          options.renderFn(req, res, views.list, {
            viewSchema: schema,
            model: model,
            dataSet: dataSet,
            page: {
              title: model.name,
              name: model.name,
              section: model.slug
            },
            url: url.parse(req.url, true).query,
            searchProperties: searchProperties
          })
        }
      )
    }
  )

  // This is the default view schema helpers.
  // Allows for options to be defined in the view schema as an array or a
  // function and then use in the presentation of the form.
  function schemaHelper(schema) {
    return function(req, res, next) {
      var fn = []
      schema.groups.forEach(function(group) {
        Object.keys(group.properties).forEach(function(key) {
          if (typeof group.properties[key].createOptions === 'function') {
            fn.push(function(callback) {
              group.properties[key].createOptions(function(error, options) {
                if (error) {
                  return callback(error)
                }
                group.properties[key].options = options
                callback()
              })
            })
          }
        })
      })
      async.parallel(fn, function(error) {
        next(error)
      })
    }
  }

  serviceLocator.router.get(
    options.adminRoute + model.slug + '/new',
    compactMiddleware('form'),
    accessCheck('create'),
    schemaHelper(schema),
    middleware.create,
    function (req, res) {

      options.renderFn(req, res, views.form, {
        viewSchema: schema,
        model: model,
        entity: model.schema.makeDefault(),
        page: {
          title: model.name,
          section: model.slug,
          action: 'create'
        },
        formType: 'createForm',
        errors: {}
      })

    }
  )

  serviceLocator.router.post(
    options.adminRoute + model.slug + '/new',
    compactMiddleware('form'),
    accessCheck('create'),
    serviceLocator.uploadDelegate.middleware,
    schema.formPostHelper,
    schemaHelper(schema),
    middleware.create,
    function (req, res, next) {

      model.create(
        req.body,
        { set: options.createValidationSet
        , tag: options.createTag },
        function (error, object) {
          if (error && error.errors) {
            options.renderFn(req, res, views.form, {
              viewSchema: schema,
              model: model,
              entity: object,
              page: {
                title: model.name,
                section: model.slug,
                action: 'create'
              },
              formType: 'createForm',
              errors: error.errors,
              unshownErrors: listUnshownErrors(error.errors, 'createForm')
            })
          } else if (error) {
            return next(error)
          } else {
            res.redirect(options.adminRoute + model.slug + '/' + object._id)
          }
        }
      )

    }
  )

  serviceLocator.router.get(
    options.adminRoute + model.slug + '/:id',
    compactMiddleware('view'),
    accessCheck('read'),
    middleware.read,
    function (req, res, next) {
      model.read(
        req.params.id,
        function (error, object) {
          if (error) {
            return next(error)
          } else {
            options.renderFn(req, res, views.view, {
              viewSchema: schema,
              model: model,
              entity: object,
              page: {
                title: model.name,
                section: model.slug,
                action: 'read'
              }
            })
          }
      })
  })

  serviceLocator.router.get(
    options.adminRoute + model.slug + '/:id/edit',
    compactMiddleware('form'),
    schemaHelper(schema),
    accessCheck('update'),
    middleware.update,
    function (req, res, next) {
      model.read(req.params.id, function (error, object) {
        if (error) {
          return next(error)
        } else {
          options.renderFn(req, res, views.form, {
            viewSchema: schema,
            model: model,
            entity: object,
            page: {
              title: model.name,
              section: model.slug,
              action: 'update'
            },
            formType: 'updateForm',
            errors: {},
            unshownErrors: []
          })
        }
      })
    }
  )

  serviceLocator.router.post(
    options.adminRoute + model.slug + '/:id/edit',
    compactMiddleware('form'),
    serviceLocator.uploadDelegate.middleware,
    schema.formPostHelper,
    accessCheck('update'),
    middleware.update,
    function (req, res, next) {
      model.update(
        req.body,
        { set: options.updateValidationSet
        , tag: options.updateTag },
        function (error, object) {
          if (error && error.errors) {
            options.renderFn(req, res, views.form, {
              viewSchema: schema,
              model: model,
              entity: object,
              page: {
                title: model.name,
                section: model.slug,
                action: 'update'
              },
              formType: 'updateForm',
              errors: error.errors,
              unshownErrors: listUnshownErrors(error.errors, 'updateForm')
            })
          } else if (error) {
            return next(error)
          } else {
            res.redirect(options.adminRoute + model.slug + '/' + object._id)
          }
        }
      )
    }
  )

  serviceLocator.router.post(
    options.adminRoute + model.slug + '/delete',
    accessCheck('delete'),
    middleware.delete,
    function(req, res) {
      model['delete'](req.body[model.idProperty], function(error) {
        if (error !== undefined) {
          res.send(404)
        } else {
          res.redirect(options.adminRoute + model.slug)
        }
      })
    }
  )
}