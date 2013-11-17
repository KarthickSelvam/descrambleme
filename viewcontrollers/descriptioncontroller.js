var http = require("http");

module.exports.controller = function(app){
        app.get('/description',function(req,res){
                require('../helpers/descriptionJson').getFullDescription(req.query.word,function(collection){
                    res.render('description/description',{data:collection})  
                });
                //dummy data, for testing
                //res.render('description/description',{data:{KeyWord:"apple",Speech:"noun",Audio:"",Definition:"a hard round red or green fruit that is white inside",Usage:"An apple a day keeps the doctor away.",Phrase:"Adam's apple",Synonyms:"Apple, fruit",Antonyms:"",Anagrams:"",Images:["http://api.pearson.com/dk/v1/images/cePNYv9xJJCzfb?apikey=6pUM7idZK2khzpx31xSfUoUapA2wQbzm","http://api.pearson.com/dk/v1/images/d4StvPsCkQpXyh?apikey=6pUM7idZK2khzpx31xSfUoUapA2wQbzm","http://api.pearson.com/dk/v1/images/dcCW57728jNFjZ?apikey=6pUM7idZK2khzpx31xSfUoUapA2wQbzm"]}})
        });
};


module.exports.socket = function(socket){

        
};