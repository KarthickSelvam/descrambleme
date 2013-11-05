function audioToggle(){
 	var audioElm = document.getElementById('bgmusic'); audioElm.muted = !audioElm.muted;
}
function SignIn(){
	$('.SignInForm').removeClass('hide');
	$('.SignUpForm').addClass('hide');
}
function SignUp(){
	$('.SignInForm').addClass('hide');
	$('.SignUpForm').removeClass('hide');
}