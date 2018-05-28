'use strict';
const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define('User', {
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        role: DataTypes.ENUM('user', 'admin')
    });

    /*User.generateHash = (password) => {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    User.validPassword = (password) => {
        return bcrypt.compareSync(password, this.local.password);
    };*/

    User.associate = (models) => {
        models.User.hasMany(models.Question);
        models.User.hasMany(models.Comment);
    };

    return User;
};
