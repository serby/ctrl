$(function() {
	$('.delete-image').click(function(e) {
		e.preventDefault();
		var
			fileLink = $(this).prev('a');
		console.log(fileLink);
		// $(this).remove();
	});
});