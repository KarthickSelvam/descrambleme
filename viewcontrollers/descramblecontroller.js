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

	
	app.post('/descramble',function(req,res){

		if (!req.username) return res.redirect("/");
		users = db.collection('users');
		users.findOne({_id:req.username},function(err,userDoc){
		        //console.log('found One : '+userDoc);
		        //validateUserDoc(err, userDoc);
		        //console.log('going to render 2 player mode: '+JSON.stringify(userDoc));
			var keyWord =req.body.word;  
			require('../helpers/descriptionJson').getFullDescription(keyWord,function(data){
				res.render('descramble/descramble',{title: "Descramble ME!",worddata:data,user:userDoc});
			},{
				encrypted:true,
				imageLimit:1,
				phrases:false,
				synonyms:true,
				anagrams:false
			}); 
			
		});
	    //res.render('descramble/descramble',{keyWord:keyWord});
	});

	//for single player mode, random word should be challenged.
	app.get('/descramble/random',function(req,res){
		if (!req.username) return res.redirect("/");
		users = db.collection('users');
		users.findOne({_id:req.username},function(err,userDoc){
			require('../helpers/randomWord').getRandomWords({limit:1},function(error,randomWords){
				if(!error){
					require('../helpers/twoWayEncryption').getTwoWayEncryption("encrypt",randomWords[0].word,function(encryptedWord){
						require('../helpers/descriptionJson').getFullDescription(encryptedWord,function(data){
							res.render('descramble/descramble',{title: "Descramble ME!",worddata:data,user:userDoc});
							},{
								encrypted:true,
								imageLimit:1,
								phrases:false,
								synonyms:true,
								anagrams:false
						});
					});
				}	
			});
		});
	});
	app.post('/encryptWord',function(req,res){
		console.log(req.body.word);
		res.send(encrypt(req.body.word));
	});
};

module.exports.socket = function(socket){
	
	// socket.on('message',function(data){
	// 	socket.broadcast.emit('message',data);	
	// });

	
};