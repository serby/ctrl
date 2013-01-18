var save = require('save')

function createModel() {
  return require('../lib/model')({
    saveFactory: {
      section: function() {
        return save('section')
      }
    }
  })
}

describe('Section Model', function() {
  describe('properties', function() {
    it('should have this structure', function() {
      var schema = createModel().schema.schema
      schema.should.have.property('_id')
      schema.should.have.property('name')
      schema.should.have.property('slug')
      schema.should.have.property('created')
      Object.keys(schema).should.have.length(4)
    })
  })
  describe('functions', function() {
    it('should have these methods', function() {

    })
  })
})