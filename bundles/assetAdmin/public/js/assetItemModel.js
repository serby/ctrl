module('assetItemModel', function (module) {

  function assetItemModel(data) {

    var model = {
      data: data,
      preview: '/images/file.png'
    };

    if ((/^image\//).test(data.type)) {
      model.preview = '/asset/thumb/' + data._id + '/' + data.basename;
    }

    model.del = function (success, error) {
      $.ajax({
        type: 'DELETE',
        url: '/admin/asset/api/' + data._id,
        dataType: 'json',
        success: success,
        error: error
      });
    };

    model.save = function (success, error) {

      $.ajax({
        type: 'PUT',
        url: '/admin/asset/api/' + data._id,
        dataType: 'json',
        data: model.data,
        success: success,
        error: error
      });
    };

    return model;

  }

  module.exports = assetItemModel;

});