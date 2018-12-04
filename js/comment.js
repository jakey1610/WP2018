$(document).ready(function(){
	$('.comment-button').click(function(){
		var postID = this.id;
		postID = postID.replace("comment-button", "");
		var commentContent = $('#comment' + postID).val();
		var dataSend = {
			"postID":postID,
			"content":commentContent
		}
		$.ajax({
			type:'POST',
			data: JSON.stringify(dataSend),
			datatype:'json',
			contentType: 'application/json',
			url: 'http://localhost:8888/commentMade',
			success: function(data){
				console.log("made");
				$('#comment' + postID).val('');
			},
			error: function(xhr, ajaxOptions, thrownError){
			}
		});
	});
});