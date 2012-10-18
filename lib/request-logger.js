module.exports = logger

var express = require('express')

/*
 * Return the express logger
 * re-routed through the application
 * logger, rather than straight to stdout.
 */
function logger(serviceLocator) {
  return express.logger(
    { format: 'dev'
    , stream:
      { write: function (data) {
          serviceLocator.logger.info(data.replace('\n', ''))
        }
      }
    })
}