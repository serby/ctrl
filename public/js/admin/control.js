$(document).ready(function() {

	/** jQuery UI Datepicker **/
	$.datepicker.setDefaults({dayNamesMin: $.datepicker._defaults.dayNamesShort});
	$(".datepicker").datepicker({
		dateFormat: 'DD d MM, yy',
		showOtherMonths: true,
		selectOtherMonths: true,
		minDate: 0,
		firstDay: 1
	});

	/** Chosen Select Boxes **/
	$(".chzn-select").chosen({
		allow_single_deselect: true,
		disable_search_threshold: 10
	});

	/** Fancybox **/
	$(".fancybox").fancybox({
		padding: 0,
		prevEffect: 'fade',
		nextEffect: 'fade'
	});

	/** Notification Bars **/
	$('.notification.close').append('<a class="button-close" href="#" />');
	$('.notification .button-close').click(function(e){
		$(this).parent('.notification').fadeTo(300, 0).slideUp(300);
		e.preventDefault();
	});

});