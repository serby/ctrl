var _ = require('underscore');

function pass(action, req, res, next) {
  next();
}

module.exports = function(app, model, options) {
  options = _.extend({
    before:   pass,
    base:     '/',
    explain:  false,
    list:     true,
    read:     true,
    create:   true,
    update:   true,
    'delete': true
  }, options);

  function before(action) {
    return function(req, res, next) {
      options.before(action, req, res, next);
    };
  }

  function methodNotAllowed(req, res, next) {
    res.status(405);
    res.json({ error: 'Method Not Allowed' });
  }

  if (options.list) {
    app.get(options.base, before('list'), function(req, res, next) {
      model.find({}).toArray(function(err, entities) {
        if (err) {
          res.status(500);
          res.json({ error: (options.explain ? err.message : 'Internal Server Error') });
        } else {
          res.status(200);
          res.json({ error: null, result: entities });
        }
      });
    });
  } else {
    app.get(options.base, methodNotAllowed);
  }

  if (options.create) {
    app.post(options.base, before('create'), function(req, res, next) {
      model.create(req.body, { tag: 'create' }, function(err, entity) {
        if (err) {
          res.status(500);
          res.json({ error: (options.explain ? err.message : 'Internal Server Error') });
        } else {
          res.status(200);
          res.json({ error: null, result: entity });
        }
      });
    });
  } else {
    app.post(options.base, methodNotAllowed);
  }

  if (options.read) {
    app.get(options.base + '/:id', before('read'), function(req, res, next) {
      model.findOne(req.params.id, function(err, entity) {
        if (err) {
          res.status(500);
          res.json({ error: (options.explain ? err.message : 'Internal Server Error') });
        } else if (!entity) {
          res.status(404);
          res.json({ error: 'Not Found' });
        } else {
          res.status(200);
          res.json({ error: null, result: entity });
        }
      });
    });
  } else {
    app.get(options.base + '/:id', methodNotAllowed);
  }

  if (options.update) {
    app.put(options.base + '/:id', before('update'), function(req, res, next) {
      model.update(req.params.id, req.body, { tag: 'update' }, function(err, entity) {
        if (err) {
          res.status(500);
          res.json({ error: (options.explain ? err.message : 'Internal Server Error') });
        } else if (!entity) {
          res.status(404);
          res.json({ error: 'Not Found' });
        } else {
          res.status(200);
          res.json({ error: null, result: entity });
        }
      });
    });
  } else {
    app.put(options.base + '/:id', methodNotAllowed);
  }

  if (options['delete']) {
    app['delete'](options.base + '/:id', before('delete'), function(req, res, next) {
      model['delete'](req.params.id, function(err) {
        if (err) {
          res.status(500);
          res.json({ error: (options.explain ? err.message : 'Internal Server Error') });
        } else {
          res.status(200);
          res.json({ error: null });
        }
      });
    });
  } else {
    app['delete'](options.base + '/:id', methodNotAllowed);
  }
};
