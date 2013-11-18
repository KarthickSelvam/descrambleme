var request = require('request');
module.exports.controller = function(app,db,sessionHandler){

	app.get('/challenge',function(req,res){

		//for pages which require login use this

		if (!req.username) return res.redirect("/");
		users = db.collection('users');
		users.findOne({_id:req.username},function(err,userDoc){
            RandomWord(function(error,data){
            	if(!error)
					res.render('twoPlayer/index',{title: "Two Player Mode - Descramble Me!",random:data,user:userDoc});
				else
					res.render('twoPlayer/index',{title: "Two Player Mode - Descramble Me!",random:[],user:userDoc});
			});
        });
		
	});
	
	app.get('/search', function (req, res){
		var searchText = req.query.searchText;
		console.log(req.query.searchText);
		getWordDetails(searchText, res);
	});

	app.get('/api/worddetails',function(req,res){
		require('../helpers/descriptionJson').getFullDescription(req.query.word,function(collection){
			res.send(collection);
		});
	});
};
function getWordDetails(value, res) {
	
	var url = 'http://api.pearson.com/v2/dictionaries/ldoce5/entries?search=dd&apikey=BDWmpINA2GBDXVLoJb3NmMbrQEC2gzdI';
	request(url,function(error,response,data){
		if(error)
			res.jsonp('error in fetching Word Details: '+error.message);			
		else
			res.jsonp(JSON.parse(data));
	});
}
module.exports.socket = function(socket){
	
	// socket.on('message',function(data){
	// 	socket.broadcast.emit('message',data);	
	// });

	
};

function RandomWord(callback){
	var url = "http://api.wordnik.com/v4/words.json/randomWords?minCorpusCount=10000&minDictionaryCount=20&excludePartOfSpeech=proper-noun,proper-noun-plural,proper-noun-posessive,suffix,family-name,idiom,affix&hasDictionaryDef=true&includePartOfSpeech=noun,verb,adjective,definite-article,conjunction&limit=25&maxLength=7&api_key=f39b86fc25aa35637620607a6760b9d5445b072c27b33304e";
	request(url,function(err,response,data){
		if(err){
			console.log('error in fetching Random Words: '+err.message);
			return callback(err,null);
		}
		callback(null,JSON.parse(data));
	});
}