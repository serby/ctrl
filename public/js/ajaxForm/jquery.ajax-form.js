(function ($) {
  $.fn.ajaxForm = function(successUrl) {

    var
      form = this;

    successUrl = successUrl || form.attr('data-success-url') || '/';

    function addFormError(input, errorMessage) {
      var errorElement = $('<p class="error-description">' + errorMessage + '</p>').hide();
      input.parent().addClass('error').append(errorElement);
      errorElement.fadeIn();
    }

    function onData(response) {
      if (response.success) {
        showThanks();
      } else {
        $('<p class="error-summary">Please check the problems with your form and try again.</p>').prependTo(form);
        $.each(response.errors, function(key, value) {
          addFormError($('*[name=' + key + ']', form), value);
        });
      }
    }

    function clearErrors() {
      $('.error-summary', form).remove();
      $('.error-description', form).remove();
      $('.error', form).removeClass('error');
    }

    function showThanks() {
      document.location = successUrl;
    }

    form.submit(function(event) {
      event.preventDefault();
      clearErrors();
      $.post(document.location.toString(), $(form).serialize(), onData);

      return false;
    });
  };

})(jQuery);