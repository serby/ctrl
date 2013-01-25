/** Notification Bars **/
var notificationClose = $('<button />').addClass('button-close').text('Close')
$('.notification.close').append(notificationClose)
$('.notification .button-close').click(function(e){
  $(this).parent('.notification').fadeTo(300, 0).slideUp(300);
  e.preventDefault();
});

/* Check nav height */
function staticNav() {
  var mainHeader = $('.main-header')
    , winHeight = $(window).height()
    , sidebarHeight = $('.user-navigation').outerHeight(true) +
                      $('.site-logo').outerHeight(true) +
                      $('.main-navigation').outerHeight(true) +
                      $('.main-footer').outerHeight(true)

  if (sidebarHeight > winHeight) {
    mainHeader.css('position', 'absolute')
  }
}

staticNav();

$(window).resize(function () {
  staticNav();
});

/** Third Level Collapsable Navigation **/
$('.sub-nav .sub-nav').hide().siblings('a').addClass('nav-expandable');
$('a.nav-expandable').click(function(e){
  $(this).toggleClass('nav-expanded').siblings('.sub-nav').slideToggle(400, function(){staticNav();});
  e.preventDefault();
});