module.exports = moduleWrapper

var through = require('through')

function moduleWrapper(filename) {

  var headerWritten = false

  function write(data) {
    if (!headerWritten) {
      this.queue(moduleHeader(filename))
      headerWritten = true
    }
    this.queue(data)
  }

  function end(data) {
    if (arguments.length) this.queue(data)
    this.queue(moduleFooter())
    this.queue(null)
  }

  var wrapper = through(write, end)
  return wrapper

}

function moduleHeader(name) {
  return 'module(\'{name}\', function (module, exports, require) {\n'.replace(/\{name\}/g, name)
}

function moduleFooter() {
  return '\n})'
}