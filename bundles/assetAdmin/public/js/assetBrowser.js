module('assetBrowser', function (module) {

  function assetBrowser(mime, cb) {

    var itemCount = 0
      , leftAssetList = $('<ul/>').addClass('left asset-list')
      , rightAssetList = $('<ul/>').addClass('right asset-list');

    function buildListItem(id) {

      var item;

      var image = $('<img/>')
        .attr('src', '/asset/thumb/' + id)
        .data('id', id)
        .on('click', function() {
          item
            .closest('.custom-content')
            .find('.selected')
            .removeClass('selected');
          $(this).addClass('selected');
        });

      image.load(function() {
        item = $('<li/>').addClass('asset-browser-item').append($(this));

        if (leftAssetList.innerHeight() < rightAssetList.innerHeight()) {
          leftAssetList.append(item);
        } else {
          rightAssetList.append(item);
        }
      });

    }

    $.getJSON('/admin/asset/api/list', function(data) {

      data.forEach(function(file) {
        if (mime.test(file.type)) {
          buildListItem(file._id);
          itemCount += 1;
        }
      });

      var dialog = $('<div/>').addClass('dialog-custom')
        , overlay = $('<div/>').addClass('dialog-overlay')
        , content = $('<div/>').addClass('custom-content');

      if (itemCount > 0) {
        content.append(leftAssetList);
        content.append(rightAssetList);
      } else {
        content.append($('<p>').addClass('empty').text('No matching assets found.'));
      }

      dialog.append(content);

      function remove() {
        overlay.remove();
        dialog.remove();
      }

      var controls = $('<div/>').addClass('controls');

      controls.append(
        $('<button/>').text('Use selected')
          .addClass('primary')
          .bind('click', function (e) {
            e.preventDefault();
            var selected = dialog.find('img.selected')
            if (selected.length > 0) {
              cb(null, selected.data('id'));
              remove();
            }
          })
      );

      controls.append(
        $('<button/>').text('Cancel')
          .bind('click', function (e) {
            e.preventDefault();
            remove();
            cb(new Error('No image selected'));
          })
      );

      dialog.append(controls);
      $('body').append(overlay, dialog);

    });

  }

  module.exports = assetBrowser;

});
