
/**
 * Module dependencies.
 */

var express = require('express');

var http = require('http');
var path = require('path');
var fs = require('fs');
//var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var SessionHandler = require('./session');
var app = express();



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//mongoose.connect('mongodb://localhost:27017/descrambleme');

// dynamically include models 
fs.readdirSync(__dirname+'/models').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      require(__dirname+'/models/' + file);
  }
});

var connection_string = 'vigneshpt:simplepassword@widmore.mongohq.com:10010/descrambleme';//'127.0.0.1:27017/descrambleme';
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}
else if(process.env.MONGOHQ_USERNAME){
	connection_string = process.env.MONGOHQ_USERNAME+":"+process.env.MONGOHQ_PASSWORD+"@widmore.mongohq.com:10010/descrambleme"
}

MongoClient.connect('mongodb://' + connection_string,{auto_reconnect:true}, function(err, db){

	
	// all environments
	if(err)
		console.error(err.message);
	var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT|| '3000';
	app.set('port', port);
	app.set("jsonp callback", true);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());

	var sessionHandler = new SessionHandler(db);
	app.use(sessionHandler.isLoggedInMiddleware);
	
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
	// dynamically include routes (Controller)
	fs.readdirSync(__dirname+'/viewcontrollers').forEach(function (file) {
	  if(file.substr(-3) == '.js') {
	      route = require(__dirname+'/viewcontrollers/' + file);
	      route.controller(app,db,sessionHandler);
	  }
	});
	
	var server=http.createServer(app);

	var io = require('socket.io').listen(server);
	io.set('log level', 2);

	//io.sockets.on('connection',require(__dirname+'/socket',io));
	require(__dirname+"/socket")(io);
	if(process.env.OPENSHIFT_NODEJ_IP){
		server.listen(app.get('port'),process.env.OPENSHIFT_NODEJS_IP||process.env.IP||"localhost", function(){
		  console.log('Express server listening on port ' + app.get('port'));
		});
	}
	else{
		server.listen(app.get('port'), function(){
		  console.log('Express server listening on port ' + app.get('port'));
		});
	}

});
