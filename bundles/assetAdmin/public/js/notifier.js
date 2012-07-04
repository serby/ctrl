module('notifier', function (module) {

  function createNotifier(el, messagesTypes) {

    var messages = {};

    messagesTypes.forEach(function (m) {

      messages[m] = {
        timeout: null,
        el: $('<div/>')
          .addClass('notification')
          .append('<p><span class="count">0</span> ' + m)
          .css({
            display: 'none',
            position: 'fixed',
            top: 10,
            width: '50%',
            left: '25%',
            right: '25%',
            zIndex: 5000
          })
      };

      el.before(messages[m].el);

    });

    function notify(messageType) {
      clearTimeout(messages[messageType].timeout);
      var count = messages[messageType].el.find('.count');
      count.text(parseInt(count.text(), 10) + 1);
      messages[messageType].el.show();
      messages[messageType].timeout = setTimeout(function () {
        messages[messageType].el.hide();
        count.text(0);
      }, 3000);
    }

    return notify;

  }

  module.exports = createNotifier;

});