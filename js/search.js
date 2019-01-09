$(document).ready(function(){
	$('#search-button').click(function(){
		var name = $('#username').val();
		$.ajax({
			url:'pmdbUsers.json',
			type:'GET',
			datatype:'json',
			success: (data)=>{
				$('#results-pane').html("");
				var user = [];
				for(var object in data){
					if(data[object]['username'].includes(name)){
						user.push(data[object]);
					}
				}
				for(i in user){
					var htmlString = '<div class="media" style = "position:relative; z-index: 0; float:bottom;"><div class="media-left media-middle"><a href="profile/'+ String(user[i]['username']) + '"><img class="media-object roundPP" src="' + user[i]['ppicture'] + '" alt="Profile Picture" height = 100, width = 100></a></div><div class="media-body"><h4 class="media-heading" style = "position:absolute;top:40%;"><a href = "profile/'+ String(user[i]['username']) + '">'+ user[i]['username'] +'</a></h4></div></div><hr style = "background-color:black;">';
					$('#results-pane').append(htmlString);
				}
				
			}
		});
	});
});