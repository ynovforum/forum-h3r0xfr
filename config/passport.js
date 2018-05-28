module.exports = (passport) => {
    const LocalStrategy = require('passport-local').Strategy;
    const bcrypt = require('bcrypt');
    const models = require('../models');

    passport.use(new LocalStrategy((username, password, callback) => {

        models.User
            .findOne({ username })
            .then((user) => {
                if(!user) {
                    return callback(null, false, req.flash('authMessage', 'Utilisateur non trouvé.'));
                }

                bcrypt.compare(password, user.password, (isValid) => {
                    if(isValid) {
                        return callback(null, false, req.flash('authMessage', 'Mot de passe incorrect.'));
                    }

                    callback(null, user);
                });
            });

    }));

    passport.serializeUser((user, callback) => {
        callback(null, user.id);
    });

    passport.deserializeUser((id, callback) => {
        models.User
            .findById(id)
            .then((user) => {
                callback(null, user);
            })
            .catch(callback);
    });
};
