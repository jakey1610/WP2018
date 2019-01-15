function postPage(){ 
	$(document).ready(function(){
		$.ajax({
			url:'../pmdbPosts.json',
			type: 'GET',
			datatype: 'json',
			success: (data)=>{
				$.ajax({
					url:'../pmdbUsers.json',
					type: 'GET',
					datatype: 'json',
					success: (data1)=>{
						var uP = data;
						var uSSet = data1;
						var message = "<script src = '../js/likeClick.js'></script><h1>Recent Posts</h1>";
						//change for http://domain.com/ + profile???
						var username = String(window.location.href).replace('https://localhost:8080/profile/', '');
						for(var object in uSSet){
							if(uSSet[object]['username'] == username.trim()){
								var uS = uSSet[object];
							}
						}
			    		for(var object in uP){
			    			if(uP[object]['user'] == username.trim()){
			    				message += '<div class="media" style = "margin-top:3%; float:bottom;"><div class="media-left media-middle"><a href="#"><img class="media-object roundPP" src="../' + uS['ppicture'] +'" alt="Profile Picture Example" height = 50, width = 50></a></div><div class="media-body"><h4 class="media-heading"><a href = "#">' +  uP[object]['user'] + '</a></h4>' + uP[object]['content'] + '</div><button class = "btn-info like-button" id = "like' + uP[object]['postID'] + '"><span class = "glyphicon glyphicon-thumbs-up" aria-hidden="true" style = "color:white;margin-left:10%;" ></span></button><p class = "likeCounter">' + uP[object]['likes'] + '</p></div>';
			    			}
			    		}
			    		if(message == "<h1>Recent Posts</h1>"){
			    			message = '<div class="media" style = "margin-top:3%; float:bottom;"><div class="media-body"><h4 class="media-heading"><a href = "#">No posts yet...</a></h4></div></div>'
			    		}
			    		$('#recent-posts-box').html(message);
					}
				});
				
	    	}
		});
	});
}
setInterval(postPage, 500);