module.exports = function(io){
	// var HallModel = require('mongoose').model('Hall');
	// socket.on('message',function(data){
	// 	socket.broadcast.emit('message',data);	
	// });
	io.sockets.on('connection',function(socket){
		require(__dirname+'/viewcontrollers/landingcontroller.js').socket(socket,io.sockets);
		require(__dirname+"/viewcontrollers/sockettestcontroller.js").socket(socket,io.sockets);
	});
	//console.log(allSockets);
	
};