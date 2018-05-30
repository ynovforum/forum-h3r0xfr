'use strict';
const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define('User', {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        bio: DataTypes.STRING,
        role: DataTypes.ENUM('user', 'admin')
    });

    User.associate = (models) => {
        models.User.hasMany(models.Question);
        models.User.hasMany(models.Comment);
    };

    return User;
};
