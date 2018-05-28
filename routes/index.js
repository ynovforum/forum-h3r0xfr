const router = require('express').Router();

const global = require('./global');
const account = require('./account');
const question = require('./question');

/*function authNeeded(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    }

    return res.redirect('/');
}*/

router.use('/', global);
router.use('/account', account);
router.use('/q', question);

module.exports = router;
