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

	$('.dropdown-toggle').dropdown()
	// $('.search-resume').on('click', function(){
	// 	var id = $(this).data('rid');
	// 	var url = '/search-resume/' +id;
	// 		$.ajax({
	// 			url: url,
	// 			type:'SEARCH',
	// 			success: function(result){
	// 				console.log('Searching resume..');
	// 				window.location.href='/search-resume';
	// 			},
	// 			error: function(err){
	// 				console.log(err);
	// 			}
	// 		});

	// });

});



// $("#input-700").fileinput({
//     uploadUrl: "http://localhost/file-upload-single/1", // server upload action
//     uploadAsync: true,
//     maxFileCount: 5
// });
