window.setInterval(function(){
	$(document).ready(() => {
		$.ajax({
			url:'/pmdbPosts.json',
			type:'GET',
			datatype:'json',
			success: (data)=>{
				$.ajax({
					url:'/pmdbComments.json',
					type:'GET',
					datatype:'json',
					success: (data3)=>{
						$.ajax({
							url:'/pmdbUsers.json',
							type:'GET',
							datatype:'json',
							success: (data2)=>{
								var prev = "";

								for (var object = data.length; object-- > 0; ){
									prev = String($('#cp'+data[object]['postID']).text());
									var prevComment = $('#comment'+data[object]['postID']);
									var postStream = '<script src = "js/comment.js"></script><script src = "js/likeClick.js"></script><div class="media" style = "margin-top:150px; float:bottom;"><div class="media-left media-middle"><a href="/profile/'+String(data2[data[object]['userID']-1]['username'])+'"><img class="media-object roundPP" src="'+ data2[data[object]['userID']-1]['ppicture'] +'" alt="Profile Picture" height = 50, width = 50 style = "position:relative; z-index:0;"></a></div><div class="media-body"><h4 class="media-heading" style = "position:relative; z-index:0;"><a href = "/profile/'+String(data2[data[object]['userID']-1]['username'])+'">'+ data[object]['user'] +'</a></h4>'+ data[object]['content'] +'</div><button class = "btn-info like-button" id = "like'+ data[object]['postID'] +'"><span class = "glyphicon glyphicon-thumbs-up" aria-hidden="true" style = "color:white;margin-left:10%;"></span></button><p id = "likes'+data[object]['postID']+'"class = "likeCounter"></p></div><br /><div class = "col"><div class="input-group"><input id = "comment'+data[object]['postID']+'" type="text" class="form-control" placeholder="Comment" aria-describedby="basic-addon1"><span class="input-group-btn"><button id = "comment-button'+data[object]['postID']+'" class="btn btn-default comment-button">Submit</button></span></div></div><div class = "col"><div id = "comments-pane'+data[object]['postID']+'" class="well well-lg" style = "text-align:center;"><div id = "cp'+data[object]['postID']+'">Nothing here yet...'+prev+'</div></div></div>';
									var postOnPage = String($('#posts').text().trim());
									var postInStorage = String($(postStream).text().trim()).split("Submit")[0];
									if(!(postOnPage.includes(postInStorage))){
										$('#posts').append(postStream);
									} 
									$('#likes'+data[object]['postID']).text(data[object]['likes']);
									var commentStream = "";
									for (var object2 in data3){
										if(data[object]['postID']==data3[object2]['postID']){
											commentStream = commentStream + "<p style = 'text-align:left;'><a style = 'position:relative;z-index:0;' href = '/profile/"+data3[object2]['username']+"'><span style = 'font-weight:bold;'>" + data3[object2]['username'] + "</span></a> - " + data3[object2]['ccontent'] + "</p>";
											var cSOnPage = String($("#cp"+data[object]['postID']).text().trim());
											var cSInStorage = String($(commentStream).text().trim());
											if(cSOnPage!=cSInStorage){
												$('#cp'+data3[object2]['postID']).html(commentStream);
											}
										}
									}
								}
							}
						});
					}
				});
			}
		});
	});	
}, 1000);
