module.exports = function viewRender(layout) {
  return function(req, res, view, properties) {
    res.render(view, properties);
  };
};