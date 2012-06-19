(function () {

  var uploader = new window.qq.FileUploaderBasic({
    element: $('#file-uploader')[0],
    button: $('#file-uploader button')[0],
    action: '/admin/asset/api/new'
  });

}());