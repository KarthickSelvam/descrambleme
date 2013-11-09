var http = require("http");

module.exports.controller = function(app){
        app.get('/description',function(req,res){
                //console.log('Problem with request: ' + req.query.word);
                //getWordDetails(res, req.query.word);
                require('../helpers/descriptionJson').getFullDescription(req.query.word,function(collection){
                    res.render('description/description',{data:collection})  
                });
        });
};


module.exports.socket = function(socket){

        
};