module('assetBrowser', function (module) {

  function assetBrowser(mime, cb) {

    var itemCount = 0
      , cols = [ $('<ul/>').addClass('asset-list')
               , $('<ul/>').addClass('asset-list')
               , $('<ul/>').addClass('asset-list')
               , $('<ul/>').addClass('asset-list')
               ];

    function buildListItem(id, basename) {

      var item;

      var image = $('<img/>')
        .attr('src', '/asset/thumb/' + id + '/' + basename)
        .data('path', id + '/' + basename)
        .on('click', function() {
          item
            .closest('.custom-content')
            .find('.selected')
            .removeClass('selected');
          $(this).addClass('selected');
        });

      image.load(function() {

        item = $('<li/>').addClass('asset-browser-item').append($(this));

        var shortest;
        cols.forEach(function (col) {
          if (!shortest || (col.innerHeight() < shortest.innerHeight())) {
            shortest = col
          }
        });

        shortest.append(item);

      });

    }

    $.getJSON('/admin/asset/api', function(data) {

      data.forEach(function(file) {
        if (mime.test(file.type)) {
          buildListItem(file._id, file.basename);
          itemCount += 1;
        }
      });

      var dialog = $('<div/>').addClass('dialog-custom')
        , overlay = $('<div/>').addClass('dialog-overlay')
        , content = $('<div/>').addClass('custom-content');

      if (itemCount > 0) {
        cols.forEach(function (col) {
          content.append(col);
        });
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
              cb(null, selected.data('path'));
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
