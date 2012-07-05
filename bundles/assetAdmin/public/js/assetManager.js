(function () {

  var assetListView = require('assetListView')
    , notifier = require('notifier')
    , notify = notifier($('#container'),
      [ 'item(s) uploaded successfully', 'item upload(s) failed'
      , 'item(s) deleted successfully', 'item delete(s) failed'
      , 'item(s) updated successfully', 'item update(s) failed'
      ])
    , assets = assetListView($('#asset-list'), notify);

  function doNothing(e, data) {
    // Yeah
  }

  function done(e, data) {
    if (Array.isArray(data.result) && data.result.length > 0) {
      $.each(data.result, function () {
        assets.add(this);
        notify('item(s) uploaded successfully');
      });
    } else {
      notify('item upload(s) failed');
    }
  }

  $('#fileupload')
    .fileupload({
      url: '/admin/asset/api/new'
    })
    .bind('fileuploadadd', doNothing)
    .bind('fileuploadsubmit', doNothing)
    .bind('fileuploadsend', doNothing)
    .bind('fileuploaddone', done)
    .bind('fileuploadfail', doNothing)
    .bind('fileuploadalways', doNothing)
    .bind('fileuploadprogress', doNothing)
    .bind('fileuploadprogressall', doNothing)
    .bind('fileuploadstart', doNothing)
    .bind('fileuploadstop', doNothing)
    .bind('submit', function (e) {
      e.preventDefault();
      $(this).find('input[type=file]').click();
    });

  assets.init();

}());