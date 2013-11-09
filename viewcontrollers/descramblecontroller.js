var crypto=require('crypto');
var http = require("http");
var wordlist = "";
var imagecollection = "";
var keyWord = "";
var Audio = "";
var Definition = ""
var Usage = "";
var Phrase = "";
var Synonyms="";
var Anagrams = "";
var Images = "";
var parseString = require('xml2js').parseString;


module.exports.controller = function(app,db,sessionHandler){
	function encrypt(text){
		var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
		var crypted = cipher.update(text,'utf8','hex')
		crypted += cipher.final('hex');
		return crypted;
	}

	function decrypt(text){
		var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq')
		var dec = decipher.update(text,'hex','utf8')
		dec += decipher.final('utf8');
		return dec;
	}
	app.post('/descramble',function(req,res){

		if (!req.username) return res.redirect("/");
		users = db.collection('users');
		users.findOne({_id:req.username},function(err,userDoc){
		        //console.log('found One : '+userDoc);
		        //validateUserDoc(err, userDoc);
		        //console.log('going to render 2 player mode: '+JSON.stringify(userDoc));
			var keyWord = decrypt(req.body.word);  
			require('../helpers/descriptionJson').getFullDescription(keyWord,function(data){
				res.render('descramble/descramble',{title: "Descramble ME!",worddata:data,user:userDoc});
			},{
				imageLimit:1,
				phrases:false,
				synonyms:true,
				anagrams:false
			}); 
			
		});
	    //res.render('descramble/descramble',{keyWord:keyWord});
	});
	app.post('/encryptWord',function(req,res){
		res.send(encrypt(req.body.word));
	});
};

module.exports.socket = function(socket){
	
	socket.on('message',function(data){
		socket.broadcast.emit('message',data);	
	});

	
};