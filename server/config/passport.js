const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ObjectId = require('mongodb').ObjectID;

exports.initializePassport =
    function initializePassport(userCollection) {
        passport.use(new LocalStrategy(
            function (username, password, done) {
                userCollection.findOne({username: username}, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, {message: 'Incorrect Username'})
                    }
                    if (user.password !== password) {
                        return done(null, false, {message: 'Incorrect password'});
                    }
                    return done(null, user);
                });
            }
        ));

        passport.serializeUser(function(user, done) {
            done(null, user._id);
        });

        passport.deserializeUser(function(id, done) {
            userCollection.findOne({_id: ObjectId(id)} , function(err, user) {
                done(err, user);
            });
        });
    };

