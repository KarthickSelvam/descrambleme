module.exports.controller = function(app,db,sessionHandler){
	app.get('/modeselect',function(req,res){
		//for pages which require login use this
		console.log(req);
		if (!req.username) return res.redirect("/");
		res.render('modeselect/index',{title: "Descramble ME!"});
	});
}