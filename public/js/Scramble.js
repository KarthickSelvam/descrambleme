
/* Socket functionality*/

var socket;
var myUserName;
socket = io.connect("http://" + location.host);
var isSocketConnected = false;

$(document).ready(function(){
	myUserName = $("#username-hidden").val();
	socket.emit('adduser', myUserName, function(data) { console.log('emit set username', data); });

	
});

/* Socket functionality ends*/