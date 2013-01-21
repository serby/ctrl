var genericViewConfig = require(__dirname + '/../lib/view-config')

describe('genericViewConfig', function () {
  describe('#createViewSchema()', function () {
    it('should not select a hidden field as the object\'s title field', function () {
      var schema = {
        groups: [{
          name: 'Test',
          description: 'This schema is a subset of what appears in the administrator bundle',
          properties: {
            _id: {type: 'hidden', view: true}
          }
        }]
      }

      ;(function (){
        genericViewConfig(schema)
      }).should.throw()
    })

    it('should not select a password field as the object\'s title field', function () {
      var schema = {
        groups: [{
          name: 'Test',
          description: 'This schema is a subset of what appears in the administrator bundle',
          properties: {
            password: {type: 'password', view: true}
          }
        }]
      }

      ;(function (){
        genericViewConfig(schema)
      }).should.throw()
    })

    it('should not select a field with view marked false as the object\'s title field', function () {
      var schema = {
        groups: [{
          name: 'Test',
          description: 'This schema is a subset of what appears in the administrator bundle',
          properties: {
            middleInitial: {view: false}
          }
        }]
      }

      ;(function (){
        genericViewConfig(schema)
      }).should.throw()
    })

    it('should select the first field with no type and view marked true as the object\'s title field', function () {
      var schema = {
        groups: [{
          name: 'Test',
          description: 'This schema is a subset of what appears in the administrator bundle',
          properties: {
            firstName: {view: true},
            lastName: {view: true}
          }
        }]
      }
      genericViewConfig(schema).title.should.equal('firstName')
    })

    it('should not override the title if the user has provided one', function () {
      var schema = {
        groups: [{
          name: 'Test',
          description: 'This schema is a subset of what appears in the administrator bundle',
          properties: {
            firstName: {},
            middleInitial: {},
            lastName: {}
          }
        }],
        title: 'lastName'
      }
      genericViewConfig(schema).title.should.equal('lastName')
    })

  })
})