module.exports = (needAuth, noAuth) => {
    const router = require('express').Router();
    const passport = require('passport');
    const bcrypt = require('bcrypt');
    const formidable = require('formidable');
    const models = require('../models');

    require('../config/passport') (passport, bcrypt);

    router.get('/', needAuth, (req, res) => {
        res.render('account/profile', {
            title: 'Mon compte',
            user: req.user,
            errorMessage: req.flash('errorMessage'),
            successMessage: req.flash('successMessage')
        });
    });

    router.get('/logout', needAuth, (req, res) => {
        req.flash('successMessage', 'Vous avez été déconnecté.');
        req.logout();
        res.redirect('/');
    });

    router.get('/login', noAuth, (req, res) => {
        res.render('account/login', {
            title: 'Connexion',
            message: req.flash('authMessage')
        });
    });

    router.post('/login', noAuth, (req, res, next) => {
        let form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            req.body = {
                username: fields.email,
                password: fields.password
            };

            passport.authenticate('local', (err, user, info) => {
                if(user) return req.login(user, () => res.redirect('/'));
                req.flash('authMessage', info.message);
                return res.redirect('back');
            })(req, res, next);
        });
    });

    router.get('/signup', noAuth, (req, res) => {
        res.render('account/signup', {
            title: 'Créer un compte',
            message: req.flash('authMessage')
        });
    });

    router.post('/signup', noAuth, (req, res) => {
        let form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            const { name, email, password, password2 } = fields;

            if(password != password2) {
                req.flash('authMessage', 'Les mots de passe doivent être identiques.');
                return res.redirect('back');
            }

            bcrypt
                .hash(password, 12)
                .then((hash) => {
                    models.User
                        .create({ name, email, password: hash })
                        .then((user) => {
                            req.login(user, () => res.redirect('/'));
                        });
                });
        });
    });

    return router;
};
