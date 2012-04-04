$(function($) {
  var titleElement = $('input[name=title]')
    , slugElement = $('input[name=slug]')
    ;

  function toUrl(value) {
    return value
      .toLowerCase()
      .replace(/[\[\]\.',{}!@£$%\^&*()_=+~`;:\|<>?\/"]/g, '')
      .replace(/(\-+|\s+)/g, '-');
  }

  function onTitleBlur(event) {
    slugElement.val(toUrl(titleElement.val()));
  }

  $('input[name=title]').blur(onTitleBlur);
});