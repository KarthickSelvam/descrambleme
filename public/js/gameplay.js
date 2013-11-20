String.prototype.shuffle = function() {
	var a = this.split(""),
		n = a.length;
	for (var i = n - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var tmp = a[i];
		a[i] = a[j];
		a[j] = tmp;
	}
	return a.join("");
}
function decrypt(word){
 	var temp=word.split('|');
 	var ranNo=temp[1];
 	var data=temp[0].split('a');
 	temp="";
 	for(var i=1;i<data.length;i++){
 		temp=temp+(String.fromCharCode(data[i]-ranNo));
 	}
 	return temp;
}


var originalWord=decrypt(WordValue);
var scrambledWord = originalWord.shuffle() + "aeiou".shuffle();
var wordLength = originalWord.length;
var clickCount = -1;



function countdownComplete() {
	showDialog({
		confirmText:"Ok",
		message:"Challenge Lost. Click Ok to learn the word",
		onConfirm:function(){
			document.location = "/description?word=" + originalWord;
		}
	});
}

function createElements(str) {

	for (i = 0; i < str.length; i++) {
		var classType = ['floating', 'floatingr', 'scaling'];
		var rand = Math.floor(Math.random() * 2);

		var animation = document.createElement('div');
		$(animation).append(str[i]).addClass(classType[rand])

		var bubbles = document.createElement('div');
		$(bubbles).addClass('bubble x' + ((i + 1) % 14) + ' ball ').append(animation)

		$("#bubble").append(bubbles);
	}

	for (j = 0; j < wordLength; j++) {
		var blanks = document.createElement('div');
		$(blanks).append('<h1></h1>').addClass('blank').attr('id', 'blank' + j)

		$("#userAnswer").append(blanks);
	}

}
var PlayerConfirm= function(){
	showDialog({
		confirmText:"Ok",
		rejectText:"Cancel",
		message:'Start the game',
		onConfirm:function(){
			$('#defni').removeClass('hide');
				var myCountdown2 = new Countdown({
				time: 60,
				width: 200,
				height: 80,
				rangeHi: "minute",
				target:"countdown-timer-div", // <- no comma on last item!
				onComplete: countdownComplete
			});
		},
		onReject:function(){
			window.location.href="/challenge";
		}
	});

}
$(document).ready(function() {
	var audioElement = document.createElement('audio');
	audioElement.setAttribute('src', '/audio/Minion_What.mp3');


	createElements(scrambledWord);

	$('.bubble').on('click', function() {
		clickCount++;
		var clickedLetter = $(this).find('div').html();
		if (originalWord[clickCount] == clickedLetter) {

			$('#userAnswer').find('#blank' + clickCount + ' h1').html(clickedLetter);
			if (clickCount + 1 == wordLength) {
				showDialog({
					confirmText:"Ok",
					message:'Congrats ! You have Passed the Challenge . Click ok! ',
					onConfirm:function(){
						document.location = "/description?word=" + originalWord;
					}
				});
			}
		} else {
			clickCount--;
			audioElement.play();
		}
	});

	var globalResult;

	// $.ajax({
	// 	url: '/api/worddetails?word=' + originalWord,
	// 	dataType: 'json',
	// 	success: function(result) {
	// 		globalResult = result;
	// 		// $("#defni").append(result.Definition);
	// 		// var urls = result.Images;
	// 		// //audio file
	// 		// var audio = document.createElement('audio');
	// 		// $(audio).attr('src', 'http://mediaapps.globalenglish.com/audio/tts.php?voice=0&speed=1&text=' + globalResult.KeyWord).attr('controls', 'controls')
	// 		// $("#audioSpan").append(audio);

	// 		// for (i = 0; i < 1; i++) {
	// 		// 	var images = document.createElement('img');
	// 		// 	$(images).addClass('hintImage').attr('src', urls[i])
	// 		// 	$("#imageSpan").append(images);
	// 		// }
	// 	}
	// });

	$('#audioHint').click(function() {
		$('#audiospan').toggle('slow')
	});
	$('#imageHint').on('click', this, function() {

		$('#hint').find('#imageSpan').removeClass('hide');
	});
	$('#audioHint').on('click', this, function() {

		$('#hint').find('#audioSpan').removeClass('hide');
	});

	setTimeout(PlayerConfirm,1500);

});