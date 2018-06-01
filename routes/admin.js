const router = require('express').Router();
const formidable = require('formidable');
const models = require('../models');

router.get('/', (req, res) => {
    models.User.findAll({ include: [models.Question, models.Comment] }).then((users) => {
        res.render('admin/users', {
            title: 'Administration',
            info: 'Cliquez sur un utilisateur pour le modifier',
            user: req.user,
            errorMessage: req.flash('errorMessage'),
            successMessage: req.flash('successMessage'),
            users: users
        });
    });
});

module.exports = router;
