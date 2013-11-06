var socket;
var myUserName;
socket = io.connect("http://" + location.host);
var isSocketConnected = false;
function bindPlayersClick(){
	$('.user').click(function(){
		
		if($("#searchWord").val()){
			socket.emit('message',{
				inferSrcUser:true,
				type:"challenge_request",
				source: "",
				message:$("#searchWord").val(),
				target:this.id
			});
		}
		else{
			alert("Please select or enter a word","Word not selected");
		}
	});
}

function updateSocketConnectivityStatus (){
	setInterval(function(){
		var connectionText = "";
		if(socket.socket.connected){
			connectionText= "Connected";
		}
		else{
			connectionText = "Disconnected";
		}
		$(".socket-status").text(connectionText);
	},1000)
}

function handleUserLeft(msg) {
    $("p#" + msg.userName).remove();
}

function appendNewUser (uname){
	$('.playerlist').append("<p id="+uname+" class='user'><b>"+uname+"</b></p>");
	bindPlayersClick();
}

$(document).ready(function(){
	myUserName = $("#usernamefield").val();
	socket.emit('adduser', myUserName, function(data) { console.log('emit set username', data); });

	socket.on('userJoined', function(msg) {
		//alert('user joined');
		appendNewUser(msg.userName, true);
	});

	socket.on('userLeft', function(msg) {
		handleUserLeft(msg);
	});
	socket.emit('getOnlineUsers');


	socket.on('updateOnlineUsers',function(usernames){
		var htmlString= "";
		usernames.forEach(function(username){
			if(username!=myUserName)
				htmlString+= "<p id="+username+" class='user'><b>"+username+"</b></p>";
		});
		$('.playerlist').html(htmlString);
		bindPlayersClick();

	});

	socket.on('message',function(data){
		if(data.target== myUserName){
			//alert(JSON.stringify(data));
			switch(data.type){
				case "challenge_request":
					///show accept decline popup.

			}
		}
	})

	$('#refresh-list-btn').click(function(){
		socket.emit('getOnlineUsers');
		bindPlayersClick();
	});

	updateSocketConnectivityStatus();
});

