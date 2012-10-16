var logger = require('../lib/logger')()

describe('logger', function() {
  describe('should have the correct interface', function() {
    it('should be able to log to info', function() {
      logger.info('This is a level "info" test')
    })
    it('should be able to log to log', function() {
      logger.log('This is a level "log" test')
    })
    it('should be able to log to warn', function() {
      logger.warn('This is a level "log" test')
    })
    it('should be able to log to silly', function() {
      logger.silly('This is a level "log" test')
    })
    it('should be able to log to error', function() {
      logger.error('This is a level "log" test')
    })
    it('should be able to log to verbose', function() {
      logger.verbose('This is a level "log" test')
    })

    it('should not be able to log to noway', function() {
      (function() {
        logger.noway('This is a level "log" test')
      }).should.throwError(/has no method 'noway'/)
    })
  })
})