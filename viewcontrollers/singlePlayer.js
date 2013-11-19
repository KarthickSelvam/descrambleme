var request = require('request');
module.exports.controller = function(app,db,sessionHandler){

	app.get('/playwithpc',function(req,res){

		//for pages which require login use this

		if (!req.username) return res.redirect("/");
		users = db.collection('users');
		users.findOne({_id:req.username},function(err,userDoc){
            RandomWord(function(error,data){
            	if(!error){
            		require('../helpers/twoWayEncryption').getTwoWayEncryption("encrypt",data[0].word,function(encryptedWord){
            				res.render('singlePlayer/index',{title: "Single Player Mode - Descramble Me!",random:encryptedWord,user:userDoc});
					}); }
     				else
					res.render('singlePlayer/index',{title: "Single Player Mode - Descramble Me!",random:[],user:userDoc});
			});
        });
		
	});
		
};

function RandomWord(callback){
	// Getting  a Random Word from api.wordnik.com
	// Setting minDictionaryCount = 1 for single word
	var url = "http://api.wordnik.com/v4/words.json/randomWords?minCorpusCount=10000&minDictionaryCount=20&excludePartOfSpeech=proper-noun,proper-noun-plural,proper-noun-posessive,suffix,family-name,idiom,affix&hasDictionaryDef=true&includePartOfSpeech=noun,verb,adjective,definite-article,conjunction&limit=1&maxLength=7&api_key=f39b86fc25aa35637620607a6760b9d5445b072c27b33304e";
	request(url,function(err,response,data){
		if(err){
			console.log('error in fetching Random Words: '+err.message);
			return callback(err,null);
		}
		callback(null,JSON.parse(data));
	});
}