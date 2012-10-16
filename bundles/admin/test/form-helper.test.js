var formHelper = require('../lib/form-helper')

describe('form-helper', function() {

  it('should be a function', function() {
    formHelper.should.be.a('function')
  })

  describe('processors', function() {
    describe('#split()', function() {
      it('should split an CSV string, striping extra commas and spaces', function() {
        var form = { tags: ' a,   b, c  , ' }
        formHelper.split('tags', form)
        form.tags.should.eql(['a', 'b', 'c'])
      })
      it('should not convert an array', function() {
        var form = { tags: [1,2,3] }
        formHelper.split('tags', form)
        form.tags.should.eql([1,2,3])
      })
      it('should not convert an object', function() {
        var form = { tags: {} }
        formHelper.split('tags', form)
        form.tags.should.eql({})
      })
    })
  })
  describe('#defaultValue()', function() {
    it('should set the default it undefined', function() {
      var form = { optIn: undefined }
      formHelper.defaultValue(false)('optIn', form)
      form.optIn.should.eql(false)
    })
    it('should not touch properties that are set ', function() {
      var form = { optIn: true, name: 'Paul', lastName: '' }
      formHelper.defaultValue(false)('optIn', form)
      formHelper.defaultValue('UNKNOWN')('name', form)
      formHelper.defaultValue('UNKNOWN')('lastName', form)
      form.optIn.should.eql(true)
      form.name.should.eql('Paul')
      form.lastName.should.eql('')
    })
  })
  describe('#boolean()', function() {
    it('should set undefined to false', function() {
      var form = { optIn: undefined }
      formHelper.boolean('optIn', form)
      form.optIn.should.eql(false)
    })
    it('should set false to false', function() {
      var form = { optIn: false }
      formHelper.boolean('optIn', form)
      form.optIn.should.eql(false)
    })
    it('should set null to false', function() {
      var form = { optIn: null }
      formHelper.boolean('optIn', form)
      form.optIn.should.eql(false)
    })
    it('should set \'\' to false', function() {
      var form = { optIn: '' }
      formHelper.boolean('optIn', form)
      form.optIn.should.eql(false)
    })
    it('should set everything else to true', function() {
      var form = { optIn: true, allow: 'Yes' }
      formHelper.boolean('optIn', form)
      formHelper.boolean('allow', form)
      form.optIn.should.eql(true)
      form.allow.should.eql(true)
    })
  })
  describe('#date()', function() {
    it('should have tests. Please implement me!')
  })
  describe('#nullOrDate()', function() {
    it('should have tests. Please implement me!')
  })
  describe('#file()', function() {
    it('should have tests. Please implement me!')
  })
  describe('#removeImage()', function() {
    it('should have tests. Please implement me!')
  })
})