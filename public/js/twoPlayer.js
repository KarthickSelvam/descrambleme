var socket;
var myUserName;
socket = io.connect("http://" + location.host);
var isSocketConnected = false;
var onlineUserTemplate= "<li class='col-md-12 btn btn-default user' id=#username#>"+
								"<span class='glyphicon glyphicon-user'></span>"+
								"<span>#username#</span>"+
							"</li>";
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
			showDialog({
				confirmText:"Ok",
				message:"Please select or enter a word"
			});
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
	if($('.playerlist').find('#'+uname).length==0){
		var onlineUser = onlineUserTemplate.replace(/#username#/g,uname);
		$('.playerlist').append(onlineUser);
		bindPlayersClick();
	}
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
				htmlString+= onlineUserTemplate.replace(/#username#/g,username);
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
					showDialog({
						confirmText:"Accept",
						rejectText:"Decline",
						message:data.source+" has invited you for a challenge. Do you accept?",
						showPic:true,
						picUrl:"/images/unknown_icon.png",
						onConfirm:function(){
							$('.pears').append('<div class="hide"><form id="fakeForm" method="post" action="/descramble"><input name="word" value="'+data.message+'"/>"</form></div>');
							$('.pears').find('#fakeForm').submit();	
						},
						onReject: function(){}

					});
					break;
				case "used_hint":
					//
					showDialog({
						confirmText:"Ok",
						message:data.source+" has used a hint."
					});
					break;
				case "victory":
				//victory or defeat
					showDialog({
						confirmText:"Ok",
						message:data.source+" won your challenge."
					});
					break;
				case "defeat":
					showDialog({
						confirmText:"Collect",
						message:data.source+" lost your challenge. You earned 10 points."
					});

			}
		}
	})

	$('#refresh-list-btn').click(function(){
		socket.emit('getOnlineUsers');
		bindPlayersClick();
	});

	updateSocketConnectivityStatus();
});

