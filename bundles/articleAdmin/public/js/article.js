$(function($) {

  var $titleControl = $('input[name=title]')
    , $slugControl = $('input[name=slug]')
    , $bodyControl = $('textarea[name=body]')
    , $typeControl = $('select[name=type]')
    ;

  function toUrl(value) {
    return value
      .toLowerCase()
      .replace(/[\[\]\.',{}!@£$%\^&*()_=+~`;:\|<>?\/"]/g, '')
      .replace(/(\-+|\s+)/g, '-');
  }

  function onTitleBlur(event) {
    $slugControl.val(toUrl($titleControl.val()));
  }

  function wysiwyg() {
    $bodyControl.redactor({
      path: '/js/redactor',
      buttons: [
        'html', '|', 'formatting', '|', 'bold', 'italic',
        'deleted', '|', 'unorderedlist', 'orderedlist',
        'outdent', 'indent', '|', 'image', 'video', 'file',
        'table', 'link', '|', 'alignleft', 'aligncenter',
        'alignright', 'justify', '|', 'horizontalrule', 'fullscreen'
      ],
      imageUpload: '/admin/asset/api/new?format=redactor',
      imageGetJson: '/admin/asset/api/list?format=redactor&type=image'
    });
  }

  $titleControl.blur(onTitleBlur);

  switch ($typeControl.val()) {
    case 'Markdown':
      break;
    case 'HTML':
      wysiwyg();
      break;
  }

  $typeControl.on('change', function() {
    var body = $bodyControl.val();

    switch ($(this).val()) {
      case 'Markdown':
        window.confirmDialog(
          'Switching to Markdown will make the field plain ' +
          'text. Do you want to remove the HTML formatting?',
          function () {
            $bodyControl.destroyEditor();
            $bodyControl.val($('<div>').html(body).text());
          },
          function () {
            $bodyControl.destroyEditor();
          },
          false,
          'Remove HTML tags',
          'Keep HTML tags'
        );
        break;
      case 'HTML':
        wysiwyg();
        break;
    }
  });
});