const router  = require('express').Router();
const models  = require('../models');

router.get('/', (req, res) => {
    models.Question.findAll({
        include: [ models.User ]
    }).then(function(questions) {
        res.render('home', {
            title: 'Liste des questions',
            questions: questions,
            user: req.user
        });
    });
});

module.exports = router;
