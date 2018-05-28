module.exports = (passport, bcrypt) => {
    const LocalStrategy = require('passport-local').Strategy;
    const models = require('../models');

    passport.use(new LocalStrategy((username, password, callback) => {

        models.User
            .findOne({
                where: {
                    username: username
                }
            })
            .then((user) => {
                if(!user) {
                    return callback(null, false, {
                        message: 'Utilisateur non trouvé.'
                    });
                }

                bcrypt.compare(password, user.password, (err, result) => {
                    if(err || !result) {
                        return callback(null, false, {
                            message: 'Mot de passe incorrect.'
                        });
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
