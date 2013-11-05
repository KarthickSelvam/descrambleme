var crypto = require('crypto');
var UsersDAO = require('./users').UsersDAO;
  //, SessionsDAO = require('../sessions').SessionsDAO;

/* The SessionHandler must be constructed with a connected db */
function SessionHandler (db) {
    "use strict";

    var users = new UsersDAO(db);
    //var sessions = new SessionsDAO(db);

    this.isLoggedInMiddleware = function(req, res, next) {
        var session_id = req.cookies.session;
        getUsername(session_id, function(err, username) {
            "use strict";

            if (!err && username) {
                req.username = username;
            }
            return next();
        });
    }

    this.displayLoginPage = function(req, res, next) {
        "use strict";
        return res.render("login", {username:"", login_error:""})
    }

    this.handleLoginRequest = function(req, res, next) {
        "use strict";

        var username = req.body.username;
        //var password = req.body.password;

        console.log("user submitted username: " + username); //+ " pass: " + password);

        users.validateLogin(username, function(err, user) {//users.validateLogin(username, password, function(err, user) {
            "use strict";

            if (err) {
                if (err.no_such_user) {
                    return res.render("/landing/index", {username:username, login_error:"No such user"});
                }
                else {
                    // Some other kind of error
                    return next(err);
                }
            }

            startSession(user['_id'], function(err, session_id) {
                "use strict";

                if (err) return next(err);

                res.cookie('session', session_id);
                return res.redirect('/modeselect');
            });
        });
    }

    this.displayLogoutPage = function(req, res, next) {
        "use strict";

        var session_id = req.cookies.session;
        endSession(session_id, function (err) {
            "use strict";

            // Even if the user wasn't logged in, redirect to home
            res.cookie('session', '');
            return res.redirect('landing/index');
        });
    }

    this.displaySignupPage =  function(req, res, next) {
        "use strict";
        res.render("signup", {username:"",email:"", username_error:"", email_error:""});
    }

    function validateSignup(username,email, errors) {//function validateSignup(username, password, verify, email, errors) {
        "use strict";
        var USER_RE = /^[a-zA-Z0-9_-]{3,20}$/;
        //var PASS_RE = /^.{3,20}$/;
        var EMAIL_RE = /^[\S]+@[\S]+\.[\S]+$/;

        errors['username_error'] = "";
        //errors['password_error'] = "";
        //errors['verify_error'] = "";
        errors['email_error'] = "";

        if (!USER_RE.test(username)) {
            errors['username_error'] = "invalid username. try just letters and numbers";
            return false;
        }
        // if (!PASS_RE.test(password)) {
        //     errors['password_error'] = "invalid password.";
        //     return false;
        // }
        // if (password != verify) {
        //     errors['verify_error'] = "password must match";
        //     return false;
        // }
        if (email != "") {
            if (!EMAIL_RE.test(email)) {
                errors['email_error'] = "invalid email address";
                return false;
            }
        }
        return true;
    }

    this.handleSignup = function(req, res, next) {
        "use strict";

        var email = req.body.email
        var username = req.body.username
        //var password = req.body.password
        //var verify = req.body.verify

        // set these up in case we have an error case
        var errors = {'username': username, 'email': email}
        if (validateSignup(username, email, errors)) {//validateSignup(username, password, verify, email, errors)
            users.addUser(username, email, function(err, user) {
                "use strict";

                if (err) {
                    // this was a duplicate
                    if (err.code == '11000') {
                        errors['username_error'] = "Username already in use. Please choose another";
                        return res.render("landing/index", errors);
                    }
                    // this was a different error
                    else {
                        return next(err);
                    }
                }
                console.log('no errors from addUser, user: '+JSON.stringify(user));
                startSession(user['_id'], function(err, session_id) {
                    "use strict";

                    if (err) return next(err);
                    console.log(errors.username_error +" .. "+errors.email_error);
                    res.cookie('session', session_id);
                    return res.redirect('/modeSelect');
                });
            });
        }
        else {
            console.log("user did not validate");
            return res.render("landing/index", errors);
        }
    }


    /*from sessions.js*/

    var sessionsCollection = db.collection("sessions");

    this.startSession = function(username, callback) {
        "use strict";

        // Generate session id
        var current_date = (new Date()).valueOf().toString();
        var random = Math.random().toString();
        var session_id = crypto.createHash('sha1').update(current_date + random).digest('hex');

        // Create session document
        var session = {'username': username, '_id': session_id}
        console.log(session);
        // Insert session document
        sessionsCollection.insert(session, function (err, result) {
            "use strict";
            callback(err, session_id);
        });
    }

    this.endSession = function(session_id, callback) {
        "use strict";
        // Remove session document
        sessionsCollection.remove({ '_id' : session_id }, function (err, numRemoved) {
            "use strict";
            callback(err);
        });
    }
    this.getUsername = function(session_id, callback) {
        "use strict";

        if (!session_id) {
            callback(Error("Session not set"), null);
            return;
        }

        sessionsCollection.findOne({ '_id' : session_id }, function(err, session) {
            "use strict";

            if (err) return callback(err, null);

            if (!session) {
                callback(new Error("Session: " + session + " does not exist"), null);
                return;
            }

            callback(null, session.username);
        });
    }


}

module.exports = SessionHandler;
