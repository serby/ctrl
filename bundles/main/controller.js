module.exports = function createRoutes (serivceLocator, bundleViewPath) {
  var viewRender = serivceLocator.viewRender(bundleViewPath);

  serivceLocator.router.get('/', function(req, res) {
    res.render(__dirname + '/views/index', {
      page: {
        layoutType: 'feature',
        title: 'Home ',
        section: 'home'
      }
    });
  });

};