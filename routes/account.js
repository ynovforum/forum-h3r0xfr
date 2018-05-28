const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const formidable = require('formidable');
const models = require('../models');

router.get('/', authNeeded, (req, res) => {
    res.render('account/profile', {
        title: 'Mon compte',
        user: req.user
    });
});

router.get('/login', (req, res) => {
    res.render('account/login', {
        title: 'Connexion',
        message: req.flash('authMessage')
    });
});

router.post('/login', (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        req.body = {
            username: fields.username,
            password: fields.password
        };

        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/account/login'
        })(req, res, next);
    });
});

router.get('/signup', (req, res) => {
    res.render('account/signup', {
        title: 'Créer un compte',
        message: req.flash('authMessage')
    });
});

router.post('/signup', (req, res) => {
    let form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
        const { username, email, password, password2 } = fields;
        bcrypt
            .hash(password, 12)
            .then((hash) => {
                models.User
                    .create({ username, email, password: hash, role: 'user' })
                    .then((user) => {
                        req.login(user, () => res.redirect('/'));
                    });
            });
    });
});

function authNeeded(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

module.exports = router;
