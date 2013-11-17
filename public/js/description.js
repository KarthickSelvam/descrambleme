var wordAudio;
$(document).ready(function(){
	$('.imgslider').flexslider({
		animation:'slide',
		slideshow:'true',
		namespace:'imgslider-',
		animationLoop:true,
		move:1,
		//directionNav:false,
		//itemWidth: $('ul.slides').width(),
		controlsContainer:'.imgslider',
		manualControls:".imgslider-direction-nav",
		nextText:"",
		prevText:""
	});
	wordAudio = document.createElement('audio');
	wordAudio.src ='http://mediaapps.globalenglish.com/audio/tts.php?voice=0&speed=1&text='+data.KeyWord;
	$('#play-word-icon').click(function(){
		if(!wordAudio && !wordAudio.src){
			wordAudio = document.createElement('audio');
			wordAudio.src ='http://mediaapps.globalenglish.com/audio/tts.php?voice=0&speed=1&text='+data.KeyWord;
		}
		wordAudio.play();
	});
});