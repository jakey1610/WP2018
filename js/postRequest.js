//Photo uploaded to database but need to ensure it is used.
window.setInterval(function(){
	$(document).ready(() => {
		$.ajax({
			url:'/pmdbPosts.json',
			type:'GET',
			datatype:'json',
			success: (data)=>{
				$.ajax({
					url:'/pmdbUsers.json',
					type:'GET',
					datatype:'json',
					success: (data2)=>{
						$('#posts').html('');
						for(var object in data){
							//Need to correctly escape this at a later date. Left open to XSS.
							//Need to make it so that each post stores the postID and the userID so that we can get pictures from User DB.
							$('#posts').append('<script src = "js/likeClick.js"></script><div class="media" style = "margin-top:150px; float:bottom;"><div class="media-left media-middle"><a href="/profile/'+String(data2[data[object]['userID']-1]['username'])+'"><img class="media-object" src="'+ data2[data[object]['userID']-1]['ppicture'] +'" alt="Profile Picture" height = 50, width = 50 style = "position:relative; z-index:0;"></a></div><div class="media-body"><h4 class="media-heading" style = "position:relative; z-index:0;"><a href = "/profile/'+String(data2[data[object]['userID']-1]['username'])+'">'+ data[object]['user'] +'</a></h4>'+ data[object]['content'] +'</div><button class = "btn-info like-button" id = "like'+ data[object]['postID'] +'"><span class = "glyphicon glyphicon-thumbs-up" aria-hidden="true" style = "color:white;margin-left:10%;"></span></button><p class = "likeCounter">'+ data[object]['likes'] +'</p></div>');
						}
					}
				});
				
				

			}
		});
	});	
}, 1000);
