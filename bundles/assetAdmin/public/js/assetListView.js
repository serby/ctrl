module('assetListView', function (module) {

  var assetItemTemplate = $('#asset-list-item-template').html()
    , AssetItemModel = require('AssetItemModel')
    , AssetItemView = require('AssetItemView');

  var assetListView = function (el, notify) {

    var assets = {};

    function renderAsset(model) {

      var asset = $(
        _.template(
          assetItemTemplate,
          _.extend({ preview: model.preview }, model.data)
        )
      );

      asset.find('button.delete').on('click', function (e) {

        function makeDeleteRequest() {
          model.del(function (data) {
            if (data.success) {
              notify('item(s) deleted successfully');
              asset.remove();
            } else {
              notify('item delete(s) failed');
            }
          }, function () {
            notify('item delete(s) failed');
          });
        }

        window.confirmDialog({
          message: 'Are you sure you want to delete this asset? Any ' +
                    'links to it will break.',
          confirm: makeDeleteRequest,
          confirmVerb: 'Delete asset',
          denyVerb: 'Don\'t delete',
          danger: true
        });

      });

      asset.find('.editable').each(function () {

        var field = $(this)
          , input = $('<input/>').hide()
          , data = field.find('.data')
          , placeholder = $('<span/>').hide();

        field
          .append(input)
          .append(placeholder);

        field.on('edit', function () {
          data.hide();
          placeholder.hide();
          input.val(data.text());
          input.show();
          input.focus();

          function blur(e) {
            field.trigger('save');
            input.off('blur', blur);
            input.off('keydown', keydown);
          }

          function keydown(e) {
            if (e.keyCode === 13 || e.keyCode === 9) {
              field.trigger('save');
              input.off('blur', blur);
              input.off('keydown', keydown);
            } else if (e.keyCode === 27) {
              field.trigger('cancel');
              input.off('blur', blur);
              input.off('keydown', keydown);
            }
          }

          input.on('keydown', keydown);
          input.on('blur', blur);

        });

        field.on('save', function () {
          data.text(input.val());
          input.hide();
          if (data.text() === '') {
            placeholder
              .text('Click to add')
              .show();
            data.hide();
          } else {
            data.show();
            model.data[field.attr('data-field-name')] = data.text();
            model.save(function (data) {
              if (data.success) {
                notify('item(s) updated successfully');
              } else {
                notify('item update(s) failed');
              }
            }, function () {
              notify('item update(s) failed');
            });
          }
        });

        field.on('cancel', function () {
          input.hide();
          if (data.text() === '') {
            placeholder
              .text('Click to add')
              .show();
            data.hide();
          } else {
            data.show();
            placeholder.hide();
          }
        });

        field.bind('click', function () {
          field.trigger('edit');
        });

        field.trigger('cancel');

      });

      return asset;

    }

    assets.init = function() {

      function populate(data) {
        $.each(data, function () {
          var model = new AssetItemModel(this)
            , view = new AssetItemView({
                model: model
              }).render();
          el.append(view.$el);
        });
      }

      $.ajax({
        url: '/admin/asset/api/list',
        dataType: 'json',
        success: populate
      });

    };

    assets.add = function (a) {
      el.append(renderAsset(assetItemModel(a)));
    };

    return assets;

  }

  module.exports = assetListView;

});