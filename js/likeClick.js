$(document).ready(function(){
	$('.like-button').click(function(){
		var id = this.id;
		id = id.replace("like", "");
		var idJ = {
			"postID":id
		}
		$.ajax({
			type:'POST',
			data: JSON.stringify(idJ),
			datatype:'json',
			contentType: 'application/json',
			url: 'http://localhost:8888/likesPost',
			success: function(data){
				if(data != "OK"){
					console.log("Already liked.");
				}
			},
			error: function(xhr, ajaxOptions, thrownError){
			}
		});
		//call the postrequest function.
		$.getScript("js/postRequest.js", function(err, data){
			console.log("Loaded.")
		});
	});
});