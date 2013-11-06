module.exports.controller = function(app,db,sessionHandler){
	app.get('/modeselect',function(req,res){
		//for pages which require login use this
		//console.log(req);
		console.log(req.username);
		if (!req.username) return res.redirect("/");
		users = db.collection('users');
		users.findOne({_id:req.username},function(err,userDoc){
			if(err) throw err;
			res.render('modeselect/index',{title: "Descramble ME!",user:userDoc});	
		});
		
	});
}