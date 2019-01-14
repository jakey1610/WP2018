$(document).ready(function(){
	$('#register-button').off('click').click(function(){
		var username = $('#unr').val();
		var firstname = $('#fnr').val();
		var surname = $('#snr').val();
		var password = $('#psr').val();
		var confpassword = $('#cpsr').val();
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1;
		var yyyy = today.getFullYear();
		if(dd<10){
		    dd='0'+dd;
		} 
		if(mm<10){
		    mm='0'+mm;
		} 
		var today = dd+'/'+mm+'/'+yyyy;
		var taken = false;
		var passnomatch = false;
		var noun = false;
		var nops = false;
		$.ajax({
			url:'pmdbUsers.json',
			type: 'GET',
			datatype: 'json',
			success: (data)=>{
				for(var object in data){
					if(data[object] == username){
						taken = true;
					} else if(password != confpassword){
						passnomatch = true;
					} else if(username.length == 0){
						noun = true;
					} else if(!password){
						nops = true;
					}

					if (taken){
						$('#alertsregister').html('<p style = "color:red">This username is already taken.</p>');
						return
					} else if (passnomatch){
						$('#alertsregister').html('<p style = "color:red">The passwords you have entered don\'t match.</p>');
						return
					} else if (noun){
						$('#alertsregister').html('<p style = "color:red">You have not entered a username.</p>');
						return
					} else if (nops){
						$('#alertsregister').html('<p style = "color:red">You have not entered a password.</p>');
						return
					} else {
						$('#alertsregister').html('');
						var userDetails = {
							"id": data[data.length-1]['id'] +1,
							"forename": firstname,
							"surname": surname,
							"username":username,
							"ppicture":"ppexample.png",
							"password":password,
							"memberDate":today
						}
						$(document).ready(function (){
							$.ajax({
						        type: 'POST',
								data: JSON.stringify(userDetails),
								datatype:'json',
								contentType: 'application/json',
					            url: 'https://localhost:8080/register',						
					            success: function(data) {
					                console.log('success');
					                window.open('https://localhost:8080/login', "_self");
					            },
						        error: function (xhr, ajaxOptions, thrownError) {

						        }
				    		});
					   });
						
					}

				}
			}
		});
	
	});
});
