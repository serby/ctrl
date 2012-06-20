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

  $titleControl.blur(onTitleBlur);

  switch ($typeControl.val()) {
    case 'Markdown':
      break;
    case 'HTML':
      $bodyControl.redactor({
        path: '/js/redactor'
      });
      break;
  }

  $typeControl.on('change', function() {
    var body = $bodyControl.val();

    switch ($(this).val()) {
      case 'Markdown':
        if (confirm('Switching type will lose formatting. Do you want to convert to plain text?')) {
          $bodyControl.destroyEditor();
          $bodyControl.val($('<div>').html(body).text());
        } else {
          $bodyControl.destroyEditor();
        }
        break;
      case 'HTML':
        $bodyControl.redactor({
          path: '/js/redactor'
        });
        break;
    }
  });
});