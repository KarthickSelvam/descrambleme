var socket;
var myUserName;
socket = io.connect('http://localhost:3000');
socket.emit('getOnlineUsers');
socket.on('updateOnlineUsers',function(usernames){
		console.log(usernames);

	});