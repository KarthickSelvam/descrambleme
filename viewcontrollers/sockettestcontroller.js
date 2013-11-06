module.exports.controller = function(app,db,sessionHandler){

	app.get('/sockettest',function(req,res){
		//for pages which require login use this
		//if (!req.username) return res.redirect("/login");
		res.render('sockettest/index');
	});
	// app.post('/signup',sessionHandler.handleSignup);
	// app.post('/login',sessionHandler.handleLoginRequest);

};
var users={};
var clientSockets={};
module.exports.socket = function(socket,allSockets){
	
	//console.log(allSockets);
	// socket.on('message',function(data){
	// 	socket.broadcast.emit('message',data);	
	// });

	socket.on('adduser',function(username){
		console.log(username);

		if(users[username]===undefined){
			users[username]= socket.id;
			clientSockets[socket.id]= username;
			userNameAvailable(socket.id,username);
			userJoined(username);
			console.log('users: '+JSON.stringify(users));
			console.log('sockets: '+JSON.stringify(clientSockets));
		}
		else if(users[username]===socket.id){
			// not sure
		}
		else{
			userNameAlreadyInUse(socket.id,username);
		}
	});
	socket.on('getOnlineUsers',function(data){
		socket.emit('updateOnlineUsers',Object.keys(users));
	});
	//allSockets.emit('connected',Object.keys(users));
	socket.on('message',function(msg){
		var srcUser;
		if(msg.inferSrcUser){
			srcUser = clientSockets[socket.id];
		}
		else{
			srcUser = msg.source;
		}

		if (msg.target == "All") {
	      // broadcast
	      // allSockets.emit('message',
	      //     {"source": srcUser,
	      //      "message": msg.message,
	      //      "target": msg.target});
	    } else {
	      // Look up the socket id
	      console.log('to particular client: '+(users[msg.target]));
	      allSockets.socket(users[msg.target]).emit('message',{
	      		"source": srcUser,
	      		"type":msg.type,
	           	"message": msg.message,
	           	"target": msg.target});
	    	}
	});

	socket.on('disconnect', function() {
	    var uName = clientSockets[socket.id];
	    delete clientSockets[socket.id];
	    delete users[uName];
	 
	    // relay this message to all the clients
	 
	    userLeft(uName);
	  });

	function userJoined(uName) {
		console.log(uName);
	    // Object.keys(clientSockets).forEach(function(sId) {
	    //   allSockets.sockets[sId].emit('userJoined', { "userName": uName });
	    // });
		allSockets.emit('userJoined', { "userName": uName });
	};

	function userLeft(uName) {
	    allSockets.emit('userLeft', { "userName": uName });
	};

	function userNameAvailable(sId, uName) {
	  setTimeout(function() {
	 
	    console.log('Sending welcome msg to ' + uName + ' at ' + sId);
	    allSockets.sockets[sId].emit('welcome', { "userName" : uName, "currentUsers": JSON.stringify(Object.keys(users)) });
	 
	  }, 500);
	}
	function userNameAlreadyInUse(sId, uName) {
	  setTimeout(function() {
	    allSockets.sockets[sId].emit('error', { "userNameInUse" : true });
	  }, 500);
	}
	
};