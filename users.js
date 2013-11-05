//var bcrypt = require('bcrypt-nodejs');

/* The UsersDAO must be constructed with a connected database object */
function UsersDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof UsersDAO)) {
        console.log('Warning: UsersDAO constructor called without "new" operator');
        return new UsersDAO(db);
    }

    var users = db.collection("users");

    this.addUser = function(username, email, callback) {//this.addUser = function(username, password, email, callback) {
        "use strict";

        // Generate password hash
        //var salt = bcrypt.genSaltSync();
        //var password_hash = bcrypt.hashSync(password, salt);

        // Create user document
        var user = {'_id': username, 'email': email};
        user['points']=0;
        user['level']=0;

        // Add email if set
        // if (email != "") {
        //     user['email'] = email;
        // }

        // TODO: hw2.3
        users.insert(user,function(err,inserted){
            if(err){callback(err,null);}
            else{
                console.log(inserted);
                callback(null,inserted[0]);
            }
        });
        //callback(Error("addUser Not Yet Implemented!"), null);
    }

    this.validateLogin = function(username, callback) { //this.validateLogin = function(username, password, callback) {
        "use strict";

        // Callback to pass to MongoDB that validates a user document
        function validateUserDoc(err, user) {
            "use strict";

            if (err) return callback(err, null);

            if (user) {
                    callback(null, user);
            // }
            // else {
            //     var no_such_user_error = new Error("User: " + user + " does not exist");
            //     // Set an extra field so we can distinguish this from a db error
            //     no_such_user_error.no_such_user = true;
            //     callback(no_such_user_error, null);
            }
        }

        // TODO: hw2.3
        console.log('username in validate: '+username);
        users.findOne({_id:username},function(err,userDoc){
            console.log('found One : '+userDoc);
            validateUserDoc(err, userDoc);
        });
        //callback(Error("validateLogin Not Yet Implemented!"), null);
    }
}

module.exports.UsersDAO = UsersDAO;
