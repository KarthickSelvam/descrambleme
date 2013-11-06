var crypto = require('crypto');
function SessionsDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof SessionsDAO)) {
        console.log('Warning: SessionsDAO constructor called without "new" operator');
        return new SessionsDAO(db);
    }

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
        console.log('from sessionDao, in getUsername');
        sessionsCollection.findOne({ '_id' : session_id }, function(err, session) {
            "use strict";

            if (err) return callback(err, null);
            console.log('from sessionDao');
            console.log(session);
            if (!session) {
                callback(new Error("Session: " + session + " does not exist"), null);
                return;
            }

            callback(null, session.username);
        });
    }

}
module.exports.SessionsDAO = SessionsDAO;