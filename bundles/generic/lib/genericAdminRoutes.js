var _ = require('lodash')
  , async = require('async')
  , url = require('url')
  , SearchQueryBuilder = require('./buildSearchQuery')
  , buildSortOptions = require('./buildSortOptions')
  , Pagination = require('../../../lib/utils/pagination');

module.exports.createRoutes = function (serviceLocator, schema, model, options) {

  var defaults = {
    createValidationSet: '',
    updateValidationSet: '',
    createTag: undefined,
    updateTag: undefined,
    requiredAccess: model.urlName,
    scripts: {},
    renderFn: null,
    adminRoute: '/admin/'
  };

  options = _.extend(defaults, options);

  var views =  {
    form: __dirname + '/../views/form',
    list: __dirname + '/../views/list',
    view: __dirname + '/../views/view'
  };

  _.extend(views, options.views);

  /*
   * Adds the common JavaScript
   * required for admin section
   */
  function compactMiddleware(view) {
    if (options.scripts[view]) {
      return serviceLocator.compact.js(
        ['global'], ['admin-common'],
        options.scripts[view]
      );
    } else {
      return serviceLocator.compact.js(['global'], ['admin-common']);
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
    );
  }

  /**
  * This ensures errors with properties that are not displayed on the form are shown
  */
  function listUnshownErrors(errors, formType) {

    return Object.keys(errors.errors).filter(function(property) {
      for (var i = 0; i < schema.groups.length; i++) {
        if ((schema.groups[i].properties[property] === undefined) || (!schema.groups[i].properties[property][formType])) {
          return true;
        }
      }
      return false;
    });
  }

  var searchProperties = SearchQueryBuilder.createSearchProperties(schema.groups)
    , buildSearchQuery = SearchQueryBuilder.createSearchQueryBuilder(
        searchProperties,
        serviceLocator.logger,
        model.name
      )
    , paginate = Pagination.createPagination(model.count, 10);

  serviceLocator.app.get(
    options.adminRoute + model.urlName,
    compactMiddleware('view'),
    buildSearchQuery,
    buildSortOptions,
    paginate,
    accessCheck('read'),
    function (req, res) {

      model.find(
        req.searchQuery,
        _.extend(req.options, req.searchOptions),
        function (errors, dataSet) {
          options.renderFn(req, res, views.list, {
            viewSchema: schema,
            model: model,
            dataSet: dataSet.toArray(),
            page: {
              title: model.name,
              name: model.name,
              section: model.urlName
            },
            url: url.parse(req.url, true).query,
            searchProperties: searchProperties
          });
        }
      );
    }
  );

  // This is the default view schema helpers.
  // Allows for options to be defined in the view schema as an array or a funciton
  // and then use in the presentation of the form.
  function schemaHelper(schema) {
    return function(req, res, next) {
      var fn = [];
      schema.groups.forEach(function(group) {
        Object.keys(group.properties).forEach(function(key) {
          if (typeof group.properties[key].createOptions === 'function') {
            fn.push(function(callback) {
              group.properties[key].createOptions(function(options) {
                group.properties[key].options = options;
                callback();
              });
            });
          }
        });
      });
      async.parallel(fn, function(errors, results) {
        next();
      });
    };
  }

  function isValidationError(error) {
    if (error === null) {
      return false;
    }
    return error.name === 'ValidationError' ? true : false;
  }

  function render500(next) {
    return next('Error saving/updating to database');
  }

  serviceLocator.app.get(
    options.adminRoute + model.urlName + '/new',
    compactMiddleware('form'),
    accessCheck('create'),
    schemaHelper(schema),
    function (req, res) {

      options.renderFn(req, res, views.form, {
        viewSchema: schema,
        model: model,
        entity: model.entityDelegate.makeDefault(),
        page: {
          title: model.name,
          section: model.urlName,
          action: 'create'
        },
        formType: 'createForm',
        errors: {}
      });

    }
  );

  serviceLocator.app.post(
    options.adminRoute + model.urlName + '/new',
    compactMiddleware('form'),
    accessCheck('create'),
    serviceLocator.uploadDelegate.middleware,
    schema.formPostHelper,
    schemaHelper(schema), function (req, res, next) {

      model.create(
        req.body,
        { validationSet: options.createValidationSet },
        function (errors, newEntity) {
          if (isValidationError(errors)) {
            options.renderFn(req, res, views.form, {
              viewSchema: schema,
              model: model,
              entity: newEntity,
              page: {
                title: model.name,
                section: model.urlName,
                action: 'create'
              },
              formType: 'createForm',
              errors: errors.errors,
              unshownErrors: listUnshownErrors(errors, 'createForm')
            });
          } else if (errors) {
            render500(next);
          } else {
            res.redirect(options.adminRoute + model.urlName + '/' + newEntity._id);
          }
        }
      );

    }
  );

  serviceLocator.app.get(
    options.adminRoute + model.urlName + '/:id',
    compactMiddleware('view'),
    accessCheck('read'), function (req, res) {
      model.read(
        req.params.id,
        function (errors, entity) {
          options.renderFn(req, res, views.view, {
            viewSchema: schema,
            model: model,
            entity: entity,
            page: {
              title: model.name,
              section: model.urlName,
              action: 'read'
            }
          });
      });
  });

  serviceLocator.app.get(
    options.adminRoute + model.urlName + '/:id/edit',
    compactMiddleware('form'),
    schemaHelper(schema),
    accessCheck('update'),
    function (req, res) {
      model.read(req.params.id, function (errors, entity) {

        options.renderFn(req, res, views.form, {
          viewSchema: schema,
          model: model,
          entity: entity,
          page: {
            title: model.name,
            section: model.urlName,
            action: 'update'
          },
          formType: 'updateForm',
          errors: {},
          unshownErrors: []
        });

      });
    }
  );

  serviceLocator.app.post(
    options.adminRoute + model.urlName + '/:id/edit',
    compactMiddleware('form'),
    serviceLocator.uploadDelegate.middleware,
    schema.formPostHelper,
    accessCheck('update'),
    function (req, res, next) {
      model.update(
        req.params.id,
        req.body,
        {
          tag: options.updateTag,
          validationSet: options.updateValidationSet
        },
        function (errors, entity) {
          if (isValidationError(errors)) {
            options.renderFn(req, res, views.form, {
              viewSchema: schema,
              model: model,
              entity: entity,
              page: {
                title: model.name,
                section: model.urlName,
                action: 'update'
              },
              formType: 'updateForm',
              errors: errors.errors,
              unshownErrors: listUnshownErrors(errors, 'updateForm')
            });
          } else if (errors) {
            render500(next);
          } else {
            res.redirect(options.adminRoute + model.urlName + '/' + entity._id);
          }
        }
      );
    }
  );

  serviceLocator.app.get(
    options.adminRoute + model.urlName + '/:id/delete',
    accessCheck('delete'),
    function(req, res, next) {
      model['delete'](req.params.id, function(error) {
        if (error !== null) {
          res.send(404);
        } else {
          res.redirect(options.adminRoute + model.urlName);
        }
      });
    }
  );
};