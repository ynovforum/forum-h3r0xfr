const router = require('express').Router();

function needAuth(req, res, next) {
    if (req.isAuthenticated())
        return next();

    req.flash('authMessage', 'Vous devez être connecté pour accéder à cette fonctionnalité.');
    res.redirect('/account/login');
}

function needAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role == 'admin')
        return next();

    req.flash('errorMessage', 'Vous n\'êtes pas autorisé à accéder à cette page.');
    res.redirect('/');
}

function noAuth(req, res, next) {
    if (!req.isAuthenticated())
        return next();

    res.redirect('/');
}

const global = require('./global');
const account = require('./account') (needAuth, noAuth);
const question = require('./question') (needAuth);
const admin = require('./admin');

router.use('/', global);
router.use('/account', account);
router.use('/q', question);
router.use('/admin', needAdmin, admin);

module.exports = router;
