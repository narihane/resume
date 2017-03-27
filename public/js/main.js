$(document).ready(function(){
	$('.delete-resume').on('click', function(){
		var id = $(this).data('id');
		var url = '/delete/' +id;
		if(confirm('Delete resume?')){
			$.ajax({
				url: url,
				type:'DELETE',
				success: function(result){
					console.log('Deleting resume..');
					window.location.href='/managers';
				},
				error: function(err){
					console.log(err);
				}
			});
		}
	});



	$('.dropdown-toggle').dropdown();



	});





//
