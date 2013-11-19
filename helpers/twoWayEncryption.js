 
 var request = require('request');
var parseString = require('xml2js').parseString;


module.exports.getTwoWayEncryption = function(mode,word, callback){

	var result = "";
	var encrypt=function(word){
            var data="";
            var temp="";
            var ranNo=Math.floor((Math.random()*100)+1);
            for(var i=0;i<word.length;i++){
            temp=word.charCodeAt(i)+ranNo;
            data=data+"a"+temp;
            }
            data=data+"|"+ranNo;
            return data;
        }


     var decrypt=function(word){
            var temp=word.split('|');
            var ranNo=temp[1];
            var data=temp[0].split('a');
            temp="";
            for(var i=1;i<data.length;i++){
                temp=temp+(String.fromCharCode(data[i]-ranNo));
            }
            return temp;
        }
        
    switch(mode)
    {
    	case "encrypt" : 
            result = encrypt(word);
            
            break;
    	case "decrypt" : 
            result = decrypt(word);
            
            break;
    }
    
    callback(result);
};