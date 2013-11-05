var socket;
var myUserName;
socket = io.connect('http://localhost:3000');


function appendNewUser (uname){
	$('.playerlist').append("<p id="+uname+" class='user'><b>"+uname+"</b></p>");
}

function setUsername() {
    myUserName = $('input#username').val();
    socket.emit('adduser', $('input#userName').val(), function(data) { console.log('emit set username', data); });
    console.log('Set user name as ' + $('input#username').val());
}

function handleUserLeft(msg) {
    $("p#" + msg.userName).remove();
}
$(document).ready(function(){
	socket.on('userJoined', function(msg) {
		//alert('user joined');
		appendNewUser(msg.userName, true);
	});

	socket.on('userLeft', function(msg) {
		handleUserLeft(msg);
	});

	

	socket.on('updateOnlineUsers',function(usernames){
		var htmlString= "";
		usernames.forEach(function(username){
			htmlString+= "<p id="+username+" class='user'><b>"+username+"</b></p>";
		});
		$('.playerlist').html(htmlString);
	});

	socket.on('error', function(msg) {
	  if (msg.userNameInUse) {
	      alert("Username already in use. Try another name.");
	  }
	});

	

	$('#mybutton').click(function(){
		setUsername();
		//alert('hi');
	});

	socket.emit('getOnlineUsers');

	$('#refresh-list-btn').click(function(){
		socket.emit('getOnlineUsers');
	});

	socket.on('message',function(data){
		if(data.target== myUserName){
			alert(JSON.stringify(data));
		}
	})
	$('.user').click(function(){
		socket.emit('message',{
			inferSrcUser:true,
			source: "",
			message:"test message",
			target:this.id
		});
	});
});

