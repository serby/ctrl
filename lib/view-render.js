module.exports = viewRender

var join = require('path').join

/*
 * Take a path and return a function
 * that will render views relative to it.
 */
function viewRender(path) {
  return function(req, res, view, properties) {
    var viewPath = join(path, '/', view)
    res.render(viewPath, properties)
  }
}