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
	

	$("#inputfile").fileinput({
     uploadUrl: '/add', // server upload action
     uploadAsync: true,
     maxFileCount: 5
 });
	$('.dropdown-toggle').dropdown();

	$('.search-resume').on('click', function(){
		console.log('ll');
		var url = '/search-resume';
			$.ajax({
				url: url,
				method:'GET',
				success: function(result){
					console.log('Searching resume..');
					window.location.href='/search-resume';
					console.log('success');
				},
				error: function(err){
					console.log(err);
				}
			});

	});

});



//
