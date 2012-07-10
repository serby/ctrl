module('FileUploadView', function (module) {

  var notification = require('notification');

  var FileUploadView = Backbone.View.extend({

    initialize: function () {


      $('#fileupload')
        .fileupload({ url: '/admin/asset/api' })
        .bind('submit', function (e) {
          e.preventDefault();
          $(this).find('input[type=file]').click();
        })
        .bind('fileuploaddone', _.bind(function (e, data) {
          if (Array.isArray(data.result) && data.result.length > 0) {
            _.each(data.result, function (result) {
              this.model.trigger('addAsset', result);
            }, this);
          } else {
            notification
              .error('Asset upload failed')
              .effect('slide');
          }
        }, this));
    }

  });

  module.exports = FileUploadView;

});