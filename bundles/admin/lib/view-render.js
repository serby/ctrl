module.exports = function viewRender() {
  return function(req, res, view, properties) {
    res.render(view, properties)
  }
}