var socket;
var myUserName;
socket = io.connect("http://" + location.host);
var isSocketConnected = false;
function bindPlayersClick(){
	$('.user').click(function(){
		var word=$("#searchWord").val();
		if(word){
			word=encrypt($("#searchWord").val());
			socket.emit('message',{
				inferSrcUser:true,
				type:"challenge_request",
				source: "",
				message:word,
				target:this.id
			});
		}
		else{
			alert("Please select or enter a word","Word not selected");
		}
	});
}
function encrypt(word){
	var data="";
	var temp="";
	var ranNo=Math.floor((Math.random()*100)+1);
	for(var i=0;i<word.length;i++){
		temp=word.charCodeAt(i)+ranNo;
		data=data+"a"+temp;
	}
	data=data+"|"+ranNo;
	return data;
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
					//assuming accepted
					console.log(data.message);
					var accept = confirm(data.source+" has challenged you. Do you accept?")
					if(accept){
						$('.pears').append('<div class="hide"><form id="fakeForm" method="post" action="/descramble"><input name="word" value="'+data.message+'"/>"</form></div>');
						$('.pears').find('#fakeForm').submit();	
					}
					break;
				case "used_hint":
					//
					alert(data.source+" has used a hint.");
					break;
				case "victory":
				//victory or defeat
					alert(data.source+" won your challenge").
					break;
				case "defeat":
					alert(data.source+" lost your challenge. Great!");

			}
		}
	})

	$('#refresh-list-btn').click(function(){
		socket.emit('getOnlineUsers');
		bindPlayersClick();
	});

	updateSocketConnectivityStatus();
});

