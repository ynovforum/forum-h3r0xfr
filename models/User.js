'use strict';
const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define('User', {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        bio: DataTypes.TEXT,
        avatar: { type: DataTypes.STRING, defaultValue: 'default.jpg' },
        role: { type: DataTypes.ENUM, values: ['user', 'admin'], defaultValue: 'user' }
    });

    User.associate = (models) => {
        models.User.hasMany(models.Question);
        models.User.hasMany(models.Comment);
    };

    return User;
};
