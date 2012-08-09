var http = require('http')
  , express = require('express')
  , request = require('request')
  , assert = require('assert')
  , generateApi = require('../');


var mockModel = {
  find: function(query, options) {
    assert.deepEqual(query, {});

    return { toArray: function(callback) {
      callback(null, [
        { id: 3, colour: 'blue' },
        { id: 7, colour: 'red' }
      ]);
    } };
  },
  findOne: function(id, callback) {
    assert.equal(id, 3);
    callback(null, { id: 3, colour: 'blue' });
  },
  create: function(query, options, callback) {
    assert.deepEqual(query, { colour: 'yellow' });
    callback(null, { id: 9, colour: 'yellow' });
  },
  update: function(id, changes, options, callback) {
    if (id === 7 || id === '7') {
      callback(null, { id: 7, colour: 'purple' });
    } else {
      assert.equal(id, 2);
      assert.deepEqual(changes, { colour: 'black' });
      callback(null);
    }
  },
  'delete': function(id, callback) {
    assert.equal(id, 9);
    callback();
  }
};

var mockErrorModel = {
  find: function(query, options) {
    return { toArray: function(callback) {
      callback(new Error(''));
    } };
  },
  findOne: function(query, callback) {
    callback(new Error(''));
  },
  create: function(query, options, callback) {
    callback(new Error(''));
  },
  update: function(id, changes, options, callback) {
    callback(new Error(''));
  },
  'delete': function(id, callback) {
    callback(new Error('delete'));
  }
};


describe('generated api', function() {

  var port = 6430
    , prefix = 'http://127.0.0.1:' + port
    , app;


  beforeEach(function(done) {
    app = express.createServer();
    app.use(express.bodyParser());
    app.listen(port, done);
  });

  afterEach(function() {
    app.close();
    prefix = 'http://127.0.0.1:' + (++port);
  });


  it('should list all resources on "GET /"', function(done) {
    generateApi(app, mockModel, { base: '/api' });

    request.get(prefix + '/api', function(err, res, body) {
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert(/^application\/json/.test(res.headers['content-type']));
      assert.deepEqual(JSON.parse(body), { error: null, result: [
        { id: 3, colour: 'blue' },
        { id: 7, colour: 'red' }
      ]});
      done();
    });
  });

  it('display a specific resource on "GET /id"', function(done) {
    generateApi(app, mockModel, { base: '/api' });

    request.get(prefix + '/api/3', function(err, res, body) {
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert(/^application\/json/.test(res.headers['content-type']));
      assert.deepEqual(JSON.parse(body), { error: null, result: { id: 3, colour: 'blue' } });
      done();
    });
  });

  it('should create a resource on "POST /"', function(done) {
    generateApi(app, mockModel, { base: '/api' });

    request.post(prefix + '/api', { form: { colour: 'yellow' } }, function(err, res, body) {
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert(/^application\/json/.test(res.headers['content-type']));
      assert.deepEqual(JSON.parse(body), { error: null, result: { id: 9, colour: 'yellow' } });
      done();
    });
  });

  it('should update a resource on "PUT /id"', function(done) {
    generateApi(app, mockModel, { base: '/api' });

    request.put(prefix + '/api/7', { form: { colour: 'purple' } }, function(err, res, body) {
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert(/^application\/json/.test(res.headers['content-type']));
      assert.deepEqual(JSON.parse(body), { error: null, result: { id: 7, colour: 'purple' } });
      done();
    });
  });

  it('should not allow PUT requests to unexisting IDs', function(done) {
    generateApi(app, mockModel, { base: '/api' });

    request.put(prefix + '/api/2', { form: { colour: 'black' } }, function(err, res, body) {
      assert.equal(err, null);
      assert.equal(res.statusCode, 404);
      assert(/^application\/json/.test(res.headers['content-type']));
      assert.deepEqual(JSON.parse(body), { error: 'Not Found' });
      done();
    });
  });

  it('should delete a resource on "DELETE /id"', function(done) {
    generateApi(app, mockModel, { base: '/api' });

    request.del(prefix + '/api/9', function(err, res, body) {
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert(/^application\/json/.test(res.headers['content-type']));
      assert.deepEqual(JSON.parse(body), { error: null });
      done();
    });
  });

  it('should invoke the "before" function with the correct action', function(done) {
    var nothing = function(){}
      , n = 0;

    generateApi(app, mockModel, { base: '/api', before: function(action, req, res, next) {
      assert.equal(action, req.query.action);
      if (++n === 5) {
        done();
      }
    } });

    request.get(prefix + '/api?action=list', nothing);
    request.post(prefix + '/api?action=create', nothing);
    request.get(prefix + '/api/3?action=read', nothing);
    request.put(prefix + '/api/3?action=update', nothing);
    request.del(prefix + '/api/3?action=delete', nothing);
  });

  it('should allow any base path', function(done) {
    generateApi(app, mockModel, { base: '/something/or/whatever' });

    request.get(prefix + '/something/or/whatever', function(err, res, body) {
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert(/^application\/json/.test(res.headers['content-type']));
      assert.deepEqual(JSON.parse(body), { error: null, result: [
        { id: 3, colour: 'blue' },
        { id: 7, colour: 'red' }
      ]});
      done();
    });
  });

  it('should reply with 405 for disallowed methods', function(done) {
    generateApi(app, mockModel, {
      'base':   '/api',
      'list':   false,
      'read':   false,
      'create': false,
      'update': false,
      'delete': false
    });

    var n = 0;

    function step(err, res, body) {
      assert.equal(err, null);
      assert.equal(res.statusCode, 405);
      assert(/^application\/json/.test(res.headers['content-type']));
      assert.deepEqual(JSON.parse(body), { error: "Method Not Allowed" });

      if (++n === 5) {
        done();
      }
    }

    request.get(prefix + '/api', step);
    request.post(prefix + '/api', step);
    request.get(prefix + '/api/3', step);
    request.put(prefix + '/api/3', step);
    request.del(prefix + '/api/3', step);
  });

  it('should hide error messages by default', function(done) {
    generateApi(app, mockErrorModel, { base: '/api' });

    var n = 0;

    function step(err, res, body) {
      assert.equal(err, null);
      assert.equal(res.statusCode, 500);
      assert(/^application\/json/.test(res.headers['content-type']));
      assert.deepEqual(JSON.parse(body), { error: 'Internal Server Error' });

      if (++n === 5) {
        done();
      }
    }

    request.get(prefix + '/api', step);
    request.post(prefix + '/api', { form: { colour: 'yellow' } }, step);
    request.get(prefix + '/api/3', step);
    request.put(prefix + '/api/7', { form: { colour: 'purple' } }, step);
    request.del(prefix + '/api/9', step);
  });

  it('should display error messages when enabled', function(done) {
    generateApi(app, mockErrorModel, { base: '/api', explain: true });

    var n = 0;

    function step(err, res, body) {
      assert.equal(err, null);
      assert.equal(res.statusCode, 500);
      assert(/^application\/json/.test(res.headers['content-type']));
      assert.notDeepEqual(JSON.parse(body), { error: 'Internal Server Error' });

      if (++n === 5) {
        done();
      }
    }

    request.get(prefix + '/api', step);
    request.post(prefix + '/api', { form: { colour: 'yellow' } }, step);
    request.get(prefix + '/api/3', step);
    request.put(prefix + '/api/7', { form: { colour: 'purple' } }, step);
    request.del(prefix + '/api/9', step);
  });

});
