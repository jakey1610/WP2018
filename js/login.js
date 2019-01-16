//Fix https requests
$(document).ready(function(){
	$('#login-button').click(function(){
		var username = $('#un').val();
		var password = $('#ps').val();
		var confpassword = $('#cps').val();
		var noun = false;
		var nops = false;
		var pscorrect = false;
		$.ajax({
			url:'pmdbUsers.json',
			type: 'GET',
			datatype: 'json',
			success: (data)=>{
				for(var object in data){
					if(username.length == 0){
						noun = true;
					} else if(password.length == 0){
						nops = true;
					}

					if (noun){
						$('#alertslogin').html('<p style = "color:red">You have not entered a username.</p>');
					} else if (nops){
						$('#alertslogin').html('<p style = "color:red">You have not entered a password.</p>');
					} else {
						
						var userDetails = {
							//Potential for a replay attack; could generate random nonce.
							"username":username,
							"password":password
						}
						$(document).ready(function (){
							$.ajax({
						        type: 'POST',
								data: JSON.stringify(userDetails),
								datatype:'json',
								contentType: 'application/json',
					            url: 'https://localhost:8080/login',						
					            success: function(data) {
					                if (data == "OK"){
										window.open('https://localhost:8080/', "_self");
					                }
					            },
						        error: function (xhr, ajaxOptions, thrownError) {
						        	$('#alertslogin').html('<p style = "color:red">Incorrect username or password.</p>');
						        }	
				    		});
						});

					}

				}
			}
		});
	});
});