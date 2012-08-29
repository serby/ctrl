var genericCrudModel = require('../lib/genericCrudModel')
  , should = require('should')
  , validity = require('validity')
  , schemata = require('schemata')
  , emptyFn = function() {}
  ;

function createModel(options) {
  var save = require('save')('contact', { logger: { info: emptyFn }})
  , schema = schemata({
    _id: {
    },
    name: {
      type: String
    },
    age: {
      type: Number,
      defaultValue: 21
    },
    email: {
      type: String,
      validators: {
        all: [validity.email]
      }
    }
  });

  return genericCrudModel('Contact', save, schema, options);
}

function createContact(model, callback) {
  model.create({name: 'Paul', age: 34, email: 'paul@serby.net' }, callback);
}


describe('genericCrudModel', function() {

  describe('#name', function() {

    it('should return the given name', function() {
      createModel().name.should.eql('Contact');
    });
  });

  describe('#slug', function() {

    it('should build the slug from name if none provided', function() {
      createModel().slug.should.eql('contact');
    });

    it('should return the given slug', function() {
      createModel({slug: 'slug'}).slug.should.eql('slug');
    });
  });

  describe('#create()', function() {

    it('should run a pre:createValidate ', function(done) {
      var model = createModel();
      model.pre('createValidate', function(object, next) {
        done();
        next(undefined, object);
      });
      model.create({name: 'Paul', age: 34, email: 'paul@serby.net' });

    });

    it('should run a pre:create', function(done) {
      var model = createModel();
      model.pre('create', function(object, next) {
        done();
        next(undefined, object);
      });
      model.create({name: 'Paul', age: 34, email: 'paul@serby.net' });
    });

    it('should not run pre:create if validation fails', function(done) {
      var model = createModel()
        , ran = false;

      model.pre('create', function(object, next) {
        ran = true;
        next(undefined, object);
      });
      model.create({name: 'Paul', age: 34, email: 'paul@serby' }, function(error, object) {
        ran.should.eql(false);
        done();
      });
    });

    it('should not run pre:create if validation fails', function(done) {
      var model = createModel()
        , ran = false;

      model.pre('create', function(object, next) {
        ran = true;
        next(undefined, object);
      });
      model.create({ name: 'Paul', age: 34, email: 'paul@serby' }, function(error, object) {
        error.should.be.instanceOf(Error);
        error.errors.should.eql({ email: 'Email must be a valid email address' });
        ran.should.eql(false);
        done();
      });
    });

    it('should pass a transformed object from pre:createValidate to pre:create', function(done) {
      var model = createModel()
        ;

      model.pre('createValidate', function(object, next) {
        object.age.should.eql(1);
        object.age = 16;
        next(undefined, object);
      });

      model.pre('create', function(object, next) {
        object.age.should.eql(16);
        object.age = 34;
        next(undefined, object);
      });

      model.create({ name: 'Paul', age: 1, email: 'paul@serby.net' }, function(error, object) {
        should.not.exist(error);
        object.age.should.eql(34);
        object.should.have.property('_id');
        done();
      });
    });
  });
  describe('#update()', function() {

    it('should run a pre:updateValidate ', function(done) {
      var model = createModel();
      createContact(model, function(error, contact) {
        model.pre('updateValidate', function(object, next) {
          done();
          next(undefined, object);
        });
        model.update(contact);
      });
    });

    it('should run a pre:update', function(done) {
      var model = createModel();
      createContact(model, function(error, contact) {
        model.pre('update', function(object, next) {
          done();
          next(undefined, object);
        });
        model.update(contact);
      });
    });

    it('should not run pre:update if validation fails', function(done) {
      var model = createModel()
        , ran = false;

      createContact(model, function(error, contact) {
        model.pre('update', function(object, next) {
          ran = true;
          next(undefined, object);
        });
        contact.email = 'paul@serby';
        model.update(contact, function(error, object) {
          error.should.be.instanceOf(Error);
          error.errors.should.eql({ email: 'Email must be a valid email address' });
          ran.should.eql(false);
          done();
        });
      });
    });

    it('should pass a transformed object from pre:updateValidate to pre:update', function(done) {
      var model = createModel()
        ;

      model.pre('updateValidate', function(object, next) {
        object.age.should.eql(1);
        object.age = 16;
        next(undefined, object);
      });

      model.pre('update', function(object, next) {
        object.age.should.eql(16);
        object.age = 34;
        next(undefined, object);
      });

      createContact(model, function(error, contact) {
        contact.age = 1;
        model.update(contact, function(error, object) {
          should.not.exist(error);
          object.age.should.eql(34);
          object.should.have.property('_id');
          done();
        });
      });
    });
  });

  describe('#read()', function() {
    it('should get item by id', function(done) {
      var model = createModel()
        ;

      createContact(model, function(error, contact) {
        model.read(contact._id, function(error, object) {
          should.not.exist(error);
          object.should.have.property('_id');
          object.name.should.eql('Paul');
          done();
        });
      });
    });

    it('should return undefined for known id', function(done) {
      var model = createModel()
        ;

      model.read(999, function(error, object) {
        should.not.exist(error);
        should.not.exist(object);
        done();
      });
    });
  });

  describe('#delete()', function() {
    it('');
  });

  describe('#count()', function() {
    it('');
  });

  describe('#find()', function() {
    it('');
  });

  describe('#makeDefault()', function() {
    it('should return default loaded object', function() {
      createModel().makeDefault().should.eql({ _id: null, name: null, age: 21, email: null });
    });
  });

});