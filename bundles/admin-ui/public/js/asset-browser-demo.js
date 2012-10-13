(function () {

  var browser = require('assetBrowser');

  $('.asset-browser').on('click', function () {
    browser(/^image\//, function (err, result) {
      $('.asset-browser').siblings('div').append(
        $('<img/>', {
          src: '/asset/thumb/' + result
        })
      );
    });
  });

}());