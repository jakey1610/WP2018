//Do some registration validation.
var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var crypto = require('crypto');
var posts = require('./pmdbPosts.json');
var session = require('express-session');
var fs = require('fs');
var ejs = require('ejs');
var upload = require('express-fileupload');
var app = express(); 
var https = require('https');
var privateKey  = fs.readFileSync('ssl/host.key', 'utf8');
var certificate = fs.readFileSync('ssl/host.cert', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);
app.use(session({secret:"kjasdhkjahsdkjaskjddhjh321j1j2kl1j", resave:false, saveUninitialized:true, cookie: { secure: false }, user:{login:false, username: -1}}));
var port = process.env.VCAP_APP_PORT || 8080;
app.set('view engine', 'ejs');
var options = {
	extensions:['css', 'js', 'png', 'json', 'ejs']
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('./', options));
let isLoggedIn = false;
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex')
            .slice(0,length); 
};
var sha512 = function(password){
    var hash = crypto.createHmac('sha512', "81aaba81a9f60d41"); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return value;
};
function saltHashPassword(userpassword) {
    // var salt = genRandomString(16); * Gives us salt of length 16 
    var passwordData = sha512(userpassword);
    return passwordData;
}
/*app.get('/pmdbUsers.json', (req, res)=>{
	if(req.headers.access_token == "concertina"){
		fs.readFile('pmdbUsers.json', function(err,data){
			var json = JSON.parse(data);
			res.status(200).send(json);
		});
	} else {
		res.sendStatus(403);
	}
})*/
app.get('/', (req, res) => {
	if(!isLoggedIn){
		req.session.user={login:false, username:-1}
	}
	fs.readFile('pmdbUsers.json', function(err, data){
		var json = JSON.parse(data);
		for(u in json){
			if(json[u]['username']==req.session['user']['username']){
				var user = json[u];
			}
		}
		res.render('index', {
		  uS: user,
		  isLoggedIn: isLoggedIn
		});
	});
});
app.get('/login', (req, res) => {
	res.render('login', {
	  isLoggedIn: isLoggedIn
	});
});
app.get('/profile/:username', (req, res) => {
	//Need to make it so that the user can view all different profiles. Default to their profile
	fs.readFile('pmdbUsers.json', function(err, data){
		var json = JSON.parse(data);
		for(u in json){
			if(json[u]['username']==req.params['username']){
				var user = json[u];
			}
		}
		if(user == undefined){
			return res.status(404).render('notFound.ejs');
		}
		fs.readFile('pmdbPosts.json', function(err, data){
			var jsonPosts = JSON.parse(data);
			var posts = [];
			for(var object in jsonPosts){
				if(jsonPosts[object]['user'] == user['username']){
					posts.push(jsonPosts[object]);
				}
			}
			if(req.session['user'] == undefined){
				req.session['user'] = {login:false, username:-1};
				res.render('profile', {
				  isLoggedIn: false,
				  uS:{login:false, username:-1},
				  uP:posts,
				  params: req.params['username']
				});
			} else {
				res.render('profile', {
				  isLoggedIn: isLoggedIn,
				  uS:req.session['user']['username'],
				  uP:posts,
				  params: user
				});
			}
			
		});
	});
});
app.get('/search', (req, res) => {
	fs.readFile('pmdbUsers.json', function(err, data){
		var json = JSON.parse(data);
		
		if(req.session['user']==undefined){
			var user = -1;
		} else{
			for(u in json){
				if(json[u]['username']==req.session['user']['username']){
					var user = json[u];
				}
			}
		}
		
		res.render('search', {
		  isLoggedIn: isLoggedIn,
		  uS:user
		});
	});
	
});
app.get('/write', (req, res) => {
	fs.readFile('pmdbUsers.json', function(err, data){
		var json = JSON.parse(data);
		if(req.session['user']==undefined){
			var user = -1;
		} else{
			for(u in json){
				if(json[u]['username']==req.session['user']['username']){
					var user = json[u];
				}
			}
		}
		//redirect if not logged in
		res.render('write', {
		  isLoggedIn: isLoggedIn,
		  //Potentially need to reduce this by 1
		  uS:user
		});
	});
});
app.use(express.json());
app.post('/register', (req, res) => {
	fs.readFile('pmdbUsers.json', function (err, data) {
	   console.log(data);
	    var json = JSON.parse(data);
	    console.log(json);
	    req.body['password'] = saltHashPassword(req.body['password']);
	    json.push(req.body);
	    fs.writeFile("pmdbUsers.json", JSON.stringify(json), function(err1){if(err1) console.log(err1);});
	});
	return res.sendStatus(200);
});
app.post('/login', (req, res) => {
	var stat = false;
	fs.readFile('pmdbUsers.json', function (err, data) {
	    var json = JSON.parse(data);
	    var jsonReq = req.body
	    for(var object in json){
	    	if(json[object]['username'] != undefined && json[object]['username'] == jsonReq['username'] && json[object]['password']==sha512(jsonReq['password'])){
	    		stat = true;
	    		isLoggedIn = true;
	    		req.session.user = {login:true, username: json[object]['username']};
	    		return res.sendStatus(200)
	    	} else {
	    		stat = false;
	    	}
	    }
	    if (!stat){
			res.sendStatus(401);
		} 
	});
});
app.get('/logout', (req, res) => {
	isLoggedIn = false;
	req.session.user = {login:false, username: undefined};
	return res.redirect('/');
});
app.post('/writeTo', (req, res) =>{
	fs.readFile('pmdbUsers.json', function(err, data1){
		fs.readFile('pmdbPosts.json', function (err, data2) {
			var json1 = JSON.parse(data1);
		    var json2 = JSON.parse(data2);
		    if (req.body['content'] === ""){
		    	return res.sendStatus(401);
		    }
		    for(u in json1){
				if(json1[u]['username']==req.session['user']['username']){
					var userID = json1[u]['id'];
				}
			}
		    newPost = {
		    	"userID":userID,
		    	"postID":json2[json2.length-1]["postID"]+1,
		    	"user": json1[userID-1]['username'],
		    	"content":req.body['content'],
		    	"likes":0
		    }
		    json2.push(newPost);
		    fs.writeFile("pmdbPosts.json", JSON.stringify(json2), function(err){if(err) console.log(err);});
		    return res.sendStatus(200)
		});
	});
	
});
//Test the liking functionality
app.post('/likesPost', (req, res) => {
	var user = req.session['user']['username'];
	if(user == -1){
		return res.sendStatus(403);
	}
	fs.readFile('pmdbUsers.json', function(err, data){
		var userID = -1;
		var json = JSON.parse(data);
		for(var object in json){
			if(json[object]['username']==user){
				userID = json[object]['id'];
			}
		}
		var postID = req.body['postID'];
		fs.readFile('pmdbLikes.json', function(err,data1){
			var json1 = JSON.parse(data1);
			for(var object1 in json1){
				if(json1[object1]['id'] == userID && json1[object1]['post-id'] == postID){
					return res.sendStatus(401);
				}
			}
			newLike = {
				"id": userID,
				"post-id": parseInt(postID)
			}
			json1.push(newLike);
			fs.writeFile("pmdbLikes.json", JSON.stringify(json1), function(err){if(err) console.log(err);});
			fs.readFile('pmdbPosts.json', function(err,data2){
				var json2 = JSON.parse(data2);
				var post = json2[postID-1];
				post['likes'] += 1;
				json2[postID-1] = post;
				fs.writeFile('pmdbPosts.json', JSON.stringify(json2), function(err){if(err) console.log(err);});
			});
			return res.sendStatus(200);
		});
	});
}); 
app.use(upload());
//Make sure only images
app.post('/fileUpload', (req,res) => {
	if(req.files){
		var file = req.files.filename;
		if(String(file.mimetype).includes("image")){
			var fileName = file.name;
			file.mv("./img/" + fileName, function(err){
				if(err){
					res.redirect('/');
				} else {
					
					fs.readFile('pmdbUsers.json', function(err, data){
						var json = JSON.parse(data);
						for(u in json){
							if(json[u]['username']==req.session['user']['username']){
								var userID = json[u]['id'];
							}
						}
						if(json[userID-1]['ppicture'] != "ppexample.png"){
							fs.unlink(json[userID-1]['ppicture'],function(err){
								if(err){
									console.log(err);
								}
							});
						}
						json[userID-1]['ppicture'] = "/img/"+fileName;
						fs.writeFile('pmdbUsers.json', JSON.stringify(json), function(err){if(err) console.log(err);});
					});
					res.status(200).redirect('/');
				}
			});
		} else {
			res.status(403).redirect('/');
		}
		
	}
});
app.get('/people', (req,res)=>{
	fs.readFile('pmdbUsers.json', function(err,data){
		var json = JSON.parse(data);
		return res.send(json);
	});
});
app.get('/people/:username', (req,res)=>{
	fs.readFile('pmdbUsers.json', function(err,data){
		var json = JSON.parse(data);
		for (u in json){
			if (json[u]['username'] == req.params['username']){
				var user = json[u]
			}
		}
		return res.send(user);
	});
});
app.post('/people', (req,res)=>{
	var username = req.headers.username;
	var fname = req.headers.forename;
	var lname = req.headers.surname;
	var psswd = saltHashPassword("");
	var img = 'ppexample.png';
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
	if(fname=="" || lname=="" || req.headers.access_token==undefined){
		return res.sendStatus(403);
	}
	if(req.headers.access_token == "concertina"){
		fs.readFile('pmdbUsers.json', function (err, data) {
		    var json = JSON.parse(data);
		    for(var object in json){
		    	if(json[object]['username']==username){
		    		return res.sendStatus(403);
		    	} 
		    }
		    var id = json[json.length-1]['id']+1
		    var userDetails = {
		    	"id":id,
		    	"forename":fname,
		    	"surname":lname,
		    	"username": username,
		    	"ppicture":img,
		    	"password":psswd,
		    	"memberDate":today
		    }
		    json.push(userDetails);
		    fs.writeFile("pmdbUsers.json", JSON.stringify(json));
		    return res.sendStatus(200);
		});
	}
	return res.sendStatus(400);
});

app.post('/commentMade', (req,res)=>{
	var content = req.body['content'];
	var postID = req.body['postID'];
	if(req.session['user']['username']==-1){
		return res.sendStatus(403);
	}
	var username = req.session['user']['username'];
	fs.readFile('pmdbComments.json', function(err,data){
		var json = JSON.parse(data);
		var commentID = json[json.length-1]['commentID'] + 1;
		fs.readFile('pmdbUsers.json', function(err,data1){
			var json1 = JSON.parse(data1);
			for(var object in json1){
				if(json1[object]['username'] == username){
					var userID = json1[object]['id'];
				}
			}
			var status = true;
			for(var object1 in json){
				if(json[object1]['commentID'] == commentID & json[object1]['postID']==postID & json[object1]['userID']==userID & json[object1]['ccontent']==content){
					status = false;
				}
			}
			if(status){
				var newComment = {
					"commentID":parseInt(commentID),
					"postID":parseInt(postID),
					"userID":parseInt(userID),
					"username":username,
					"ccontent":content
				};
				json.push(newComment);
				fs.writeFile('pmdbComments.json',JSON.stringify(json), function(err){if(err) console.log(err);});
			}
			
		});
	});
	return res.sendStatus(200);
});

app.all('*', (req,res)=>{
	res.render('notFound.ejs');
});
// app.listen(8888);
httpsServer.listen(port);
module.exports = app;
console.log("Server online");

