var request = require('request');
var parseString = require('xml2js').parseString;


module.exports.getRandomWords = function(options,callback){
	limit = 25;
	if(typeof options !== "undefined" && typeof options.limit !== "undefined"){
        limit = options.limit;
    }
	var url = "http://api.wordnik.com/v4/words.json/randomWords?minCorpusCount=10000&minDictionaryCount=20&excludePartOfSpeech=proper-noun,proper-noun-plural,proper-noun-posessive,suffix,family-name,idiom,affix&hasDictionaryDef=true&includePartOfSpeech=noun,verb,adjective,definite-article,conjunction&limit="+limit+"&maxLength=7&api_key=f39b86fc25aa35637620607a6760b9d5445b072c27b33304e";
	request(url,function(err,response,data){
		if(err){
			console.log('error in fetching Random Words: '+err.message);
			return callback(err,null);
		}
		callback(null,JSON.parse(data));
		
	});
}