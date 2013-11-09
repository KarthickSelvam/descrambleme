module.exports.controller = function(app,db,sessionHandler){

	app.get('/challenge',function(req,res){

		//for pages which require login use this
		if (!req.username) return res.redirect("/");
		users = db.collection('users');
		users.findOne({_id:req.username},function(err,userDoc){
            //console.log('found One : '+userDoc);
            //validateUserDoc(err, userDoc);
            //console.log('going to render 2 player mode: '+JSON.stringify(userDoc));
            RandomWord(function(data){
				res.render('twoPlayer/index',{title: "This is Two Player Index!",random:data,user:userDoc});
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
	var http = require("http");
  	var options = {
		host : 'api.pearson.com',
		path : '/v2/dictionaries/ldoce5/entries?search='+value+'&apikey=BDWmpINA2GBDXVLoJb3NmMbrQEC2gzdI',
		port : 80,
		method : 'GET'
	}

	var request = http.request(options, function(response){
		var body = ""
		response.on('data', function(data) {
			body += data;
		});
		response.on('end', function() {
			res.jsonp(JSON.parse(body));	
			//res.render('description/description',{data:JSON.parse(body)});
		});
	});
	
  request.on('error', function(e) {
		console.log('Problem with request: ' + e.message);
  });
  request.end();
}
module.exports.socket = function(socket){
	
	// socket.on('message',function(data){
	// 	socket.broadcast.emit('message',data);	
	// });

	
};

function RandomWord(callback){
	var http=require('http');
	var WordNikApiKey="f39b86fc25aa35637620607a6760b9d5445b072c27b33304e";
	var GetValue="minCorpusCount=10000&minDictionaryCount=20&excludePartOfSpeech=proper-noun,proper-noun-plural,proper-noun-posessive,suffix,family-name,idiom,affix&hasDictionaryDef=true&includePartOfSpeech=noun,verb,adjective,definite-article,conjunction&limit=25&maxLength=7&api_key="+WordNikApiKey;
	var options = {
  		host: 'api.wordnik.com',
  		port:'80',
  		path: '/v4/words.json/randomWords?'+GetValue
 	};
	var reques = http.request(options, function(response) {
		response.setEncoding('utf8');
		var outputData = "";
	  	response.on('data', function (chunk) {
	  		outputData += chunk;
		});
	 	response.on('end',function(chunk){
  			data=JSON.parse(outputData);

  			callback(data);
  		});
  	});
  	reques.end();
}