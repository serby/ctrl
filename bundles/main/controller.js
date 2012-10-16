module.exports = function createRoutes (serivceLocator) {
  serivceLocator.router.get('/', function(req, res) {
    res.render(__dirname + '/views/index', {
      page: {
        layoutType: 'feature',
        title: 'Home ',
        section: 'home'
      }
    })
  })
}