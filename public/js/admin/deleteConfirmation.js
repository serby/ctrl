$('a.delete').click(function(e) {
	var confirmed = confirm("Are you sure you want to delete this item?");
	if (!confirmed){
		return false;
	}
});