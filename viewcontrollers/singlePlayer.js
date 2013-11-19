//var request = require('request');
module.exports.controller = function(app,db,sessionHandler){

	app.get('/playwithpc',function(req,res){

		//for pages which require login use this

		if (!req.username) return res.redirect("/");
		users = db.collection('users');
		users.findOne({_id:req.username},function(err,userDoc){
            if(err){
            	console.log('error: '+err.message);
            	throw err;
            }
            else{
            	res.render('singlePlayer/index',{title: "Single Player Mode - Descramble Me!",user:userDoc});
        	}
 
        });
		
	});
		
};

