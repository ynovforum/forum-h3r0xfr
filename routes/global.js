const router  = require('express').Router();
const models  = require('../models');

router.get('/', (req, res) => {
    models.Question.findAll({
        include: [ models.User, models.Comment ]
    }).then(function(questions) {
        res.render('home', {
            title: 'Liste des questions',
            questions: questions,
            user: req.user,
            errorMessage: req.flash('errorMessage'),
            successMessage: req.flash('successMessage')
        });
    });
});

module.exports = router;
