module.exports = (needAuth) => {
    const router = require('express').Router();
    const slug = require('limax');
    const formidable = require('formidable');
    const models = require('../models');

    router.get('/publish', needAuth, (req, res) => {
        res.render('question/publish', {
            title: 'Publier une question',
            user: req.user,
            errorMessage: req.flash('errorMessage'),
            successMessage: req.flash('successMessage')
        });
    });

    router.post('/publish', needAuth, (req, res) => {
        let form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            if(fields.title.replace(/\s/g, '').length < 1 || fields.description.length < 1) {
                req.flash('errorMessage', 'Vous devez compléter tous les champs.');
                return res.redirect('/q/publish');
            }

            let urlname = slug(fields.title);
            models.Question.create({
                title: fields.title,
                description: fields.description,
                urlname: urlname,
                UserId: req.user.id
            }).then((question) => {
                res.redirect('/q/' + formatUrl(question.id, question.urlname));
            });
        });
    });

    router.get('/:id-:urlname', (req, res) => {
        models.Question.findOne({
            where: { id: req.params.id, urlname: req.params.urlname },
            include: [models.User, { model: models.Comment, include: [models.User] }]
        }).then((question) => {
            res.render('question/detail', {
                title: question.title,
                question: question,
                user: req.user,
                errorMessage: req.flash('errorMessage'),
                successMessage: req.flash('successMessage')
            });
        });
    });

    router.post('/:id/resolve', (req, res) => {
        models.Question.update({
            resolvedAt: models.sequelize.fn('NOW')
        }, {
            where: { id: req.params.id }
        }).then((question) => {
            req.flash('successMessage', 'La question a été marquée comme résolue.');
            res.redirect('back');
        });
    });

    router.get('/:id/delete', (req, res) => {
        models.Question.destroy({
            where: { id: req.params.id }
        }).then(() => {
            req.flash('successMessage', 'La question a été supprimée.');
            res.redirect('/');
        });
    });

    router.post('/:id/edit', (req, res) => {
        let form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            const { title, description } = fields;
            console.log(fields);

            models.Question.update({ title, description }, {
                where: { id: req.params.id }
            }).then((question) => {
                req.flash('successMessage', 'Les modifications ont été enregistrées.');
                res.redirect('back');
            });
        });
    });

    // Comments
    router.post('/:id-:urlname', needAuth, (req, res) => {
        let form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            models.Comment.create({
                content: fields.content,
                QuestionId: req.params.id,
                UserId: req.user.id
            }).then((comment) => {
                req.flash('successMessage', 'Votre commentaire a été ajouté.');
                res.redirect('back');
            });
        });
    });

    router.get('/comment/:id/delete', needAuth, (req, res) => {
        models.Comment.findOne({
            where: { id: req.params.id, UserId: req.user.id }
        }).then((comment) => {
            comment.destroy();
            req.flash('successMessage', 'Votre commentaire a été supprimé.');
            res.redirect('back');
        });
    });

    function formatUrl(id, urlname) {
        return id + '-' + urlname;
    }

    return router;
};
