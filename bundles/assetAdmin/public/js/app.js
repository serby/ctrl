(function () {

  function doNothing(e, data) {
    // Yeah
  }

  function done(e, data) {
    console.log(e);
    console.log(data);
    console.log('event handled');
  }

  $('#fileupload')
    .fileupload()
    .bind('fileuploadadd', doNothing)
    .bind('fileuploadsubmit', doNothing)
    .bind('fileuploadsend', doNothing)
    .bind('fileuploaddone', done)
    .bind('fileuploadfail', doNothing)
    .bind('fileuploadalways', doNothing)
    .bind('fileuploadprogress', doNothing)
    .bind('fileuploadprogressall', doNothing)
    .bind('fileuploadstart', doNothing)
    .bind('fileuploadstop', doNothing);

  $('#fileupload').fileupload(
    'option', {
      url: '/path/to/upload/handler.json',
      autoStart: false
    }
  );

}());