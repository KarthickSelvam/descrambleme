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


module.exports.controller = function(app){
	function enc(str) {
	    var encoded = "";
	    for (i=0; i<str.length;i++) {
	        var a = str.charCodeAt(i);
	        var b = a ^ 123;    // bitwise XOR with any number, e.g. 123
	        encoded = encoded+String.fromCharCode(beer);
	    }
	    return encoded;
	}
	app.get('/descramble',function(req,res){
		var keyWord = enc(req.query.word);
	    res.render('descramble/descramble',{keyWord:keyWord});
	});
};

module.exports.socket = function(socket){
	
	socket.on('message',function(data){
		socket.broadcast.emit('message',data);	
	});

	
};