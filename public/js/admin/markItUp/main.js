// This file requires 'html.js' and 'markdown.js' to be included before use
$(function() {

  var typeDropdown = $('select[name=type]')
    , markItUp = $('.markItUp');

  function setMarkItUp(dropdownOption) {
    markItUp.markItUpRemove();
    switch(dropdownOption) {
      case 'Markdown':
        markItUp.markItUp(markdownSettings);
        break;
      case 'HTML':
        markItUp.markItUp(htmlSettings);
        break;
      default:
        return false;
    }
  }

  typeDropdown.bind('change', function() {
    setMarkItUp(typeDropdown.val());
  });

  typeDropdown.trigger('change');

});