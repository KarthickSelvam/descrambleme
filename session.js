var crypto = require('crypto');
var UsersDAO = require('./users').UsersDAO
  , SessionsDAO = require('./sessionDao').SessionsDAO;

/* The SessionHandler must be constructed with a connected db */
function SessionHandler (db) {
    "use strict";
/*from sessions.js*/

    


    var users = new UsersDAO(db);
    var sessions = new SessionsDAO(db);

    this.isLoggedInMiddleware = function(req, res, next) {
        var session_id = req.cookies.session;
        console.log('session id passed to middleware: '+session_id);
        sessions.getUsername(session_id, function(err, username) {
            "use strict";
            console.log('in getUserName: '+username);
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
                    return res.render("landing/index", {title: "Descramble ME!",username:username, errors:{username_error:"No such user"}});
                }
                else {
                    // Some other kind of error
                    return next(err);
                }
            }

            sessions.startSession(user['_id'], function(err, session_id) {
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
        sessions.endSession(session_id, function (err) {
            "use strict";

            // Even if the user wasn't logged in, redirect to home
            res.cookie('session', '');
            return res.redirect('/');
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
                        return res.render("landing/index", {title: "Descramble ME!",errors:errors});
                    }
                    // this was a different error
                    else {
                        return next(err);
                    }
                }
                console.log('no errors from addUser, user: '+JSON.stringify(user));
                sessions.startSession(user['_id'], function(err, session_id) {
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
            return res.render("landing/index",{title: "Descramble ME!", errors:errors});
        }
    }


    


}




module.exports = SessionHandler;
