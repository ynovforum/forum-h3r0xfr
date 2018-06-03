module.exports = (needAuth, noAuth) => {
    const router = require('express').Router();
    const fs = require('fs');
    const passport = require('passport');
    const bcrypt = require('bcrypt');
    const formidable = require('formidable');
    const models = require('../models');

    require('../config/passport') (passport, bcrypt);

    function checkUser(req, res) {
        let id = req.params.id;

        if(id) {
            if(!req.isAuthenticated() || req.user.role != 'admin') {
                req.flash('errorMessage', 'Vous n\'êtes pas autorisé à accéder à cette page.');
                return res.redirect('/');
            }
        } else {
            id = req.user.id;
        }

        return id;
    }

    router.get('/:id(\\d+)*?', needAuth, (req, res) => {
        let userId = checkUser(req, res);

        models.User.findOne({
            where: { id: userId },
            include: [models.Question, { model: models.Comment, include: [models.Question] }]
        }).then((user) => {
            res.render('account/profile', {
                title: 'Mon compte',
                user: req.user,
                errorMessage: req.flash('errorMessage'),
                successMessage: req.flash('successMessage'),
                userData: user,
                roles: models.User.rawAttributes.role.values
            });
        });
    });

    router.post('/:id(\\d+)*?', needAuth, (req, res) => {
        let userId = checkUser(req, res);
        let form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            let { name, email, role, bio } = fields;

            models.User.findOne({ where: { id: userId } }).then((user) => {
                let uAvatar = { name: user.avatar };

                if(files.avatar.size !== 0 && files.avatar.name.length > 0) {
                    console.log(files.avatar);
                    uAvatar = files.avatar;

                    uAvatar.name = Date.now() + '_' + uAvatar.name;
                    uAvatar.name.replace(/ /g, '_');

                    let oldpath = uAvatar.path;
                    let newpath = './public/assets/img/avatars/' + uAvatar.name;

                    if(req.user.role != 'admin' && role != 'user')
                        role = 'user';

                    if(!uAvatar.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
                        req.flash('errorMessage', 'Les extensions acceptées pour l\'avatar sont : jpg, jpeg, png, gif');
                        return res.redirect('back');
                    }

                    fs.rename(oldpath, newpath, (err) => {
                        if (err) {
                            console.log(err);
                            req.flash('errorMessage', 'Une erreur est survenue lors de l\'envoi du fichier.');
                            return res.redirect('back');
                        }
                    });

                    if(user.avatar != 'default.jpg') {
                        fs.unlink('./public/assets/img/avatars/' + user.avatar);
                    }
                }

                user.update({ name, email, role, bio, avatar: uAvatar.name }).then((user) => {
                    req.flash('successMessage', 'Les informations de compte ont été enregistrées.');
                    res.redirect('back');
                });
            });
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
                            models.User.count().then((count) => {
                                if(count == 1) {
                                    user.update({ role: 'admin' });
                                    req.flash('successMessage', 'Votre compte a été créé avec succès. Le rôle d\'administrateur vous a été assigné (premier utilisateur inscrit).');
                                } else {
                                    req.flash('successMessage', 'Votre compte a été créé avec succès. Modifiez maintenant votre avatar et votre bio dans votre <a href="/account">profil</a>.');
                                }

                                req.login(user, () => res.redirect('/'));
                            });
                        });
                });
        });
    });

    return router;
};
