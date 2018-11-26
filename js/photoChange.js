$(document).ready(function(){
	$('.pp-button').click(function(){
		var id = this.id;
		id = id.replace("pp", "");
		$("input:file").change(function (){
       		var fileName = $(this).val().split('/').pop().split('\\').pop();
       		console.log(fileName);
       		$('#ppProfile').attr('src', "../img/"+fileName);
       		//Need to get images uploading to the server.
       		//Need to update the pmdbUsers.
     	});
	});
});