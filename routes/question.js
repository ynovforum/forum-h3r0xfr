const router = require('express').Router();
const slug = require('limax');
const formidable = require('formidable');
const models = require('../models');

router.get('/create', (req, res) => {
    res.render('question/create', {
        title: 'Créer une question'
    });
});

router.post('/create', (req, res) => {
    let form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
        let urlname = slug(fields.title);
        models.Question.create({
            title: fields.title,
            content: fields.content,
            urlname: urlname
        }).then((question) => {
            res.redirect('/q/' + formatUrl(question.id, question.urlname));
        });
    });
});

router.get('/:id-:urlname', (req, res) => {
    models.Question.findOne({
        where: { id: req.params.id, urlname: req.params.urlname }
    }, {
        include: [ models.User, models.Comment ]
    }).then((question) => {
        res.render('question/detail', {
            title: question.title,
            question: question
        });
    });
});

function formatUrl(id, urlname) {
    return id + '-' + urlname;
}

module.exports = router;
