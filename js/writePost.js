$(document).ready(function(){
	$("#post-button").click(function(){
		var id = document
  				.querySelector('script[data-id="wPScript"][one]')
  				.getAttribute('one');
		var content = $("#post").val();
		var newPost = {
			"id":id,
			"content":content
		}
		$.ajax({
			type: 'POST',
			data: JSON.stringify(newPost),
			datatype:'json',
			contentType: 'application/json',
			url: 'http://localhost:8888/writeTo',						
			success: function(data) {
				if (data == "OK"){
					window.open('https://localhost:8080/', "_self");
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
			}	
		});
	});
});