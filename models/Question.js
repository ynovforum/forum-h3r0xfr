'use strict';

module.exports = (sequelize, DataTypes) => {
    let Question = sequelize.define('Question', {
        title: DataTypes.STRING,
        content: DataTypes.STRING,
        urlname: DataTypes.STRING
    });

    Question.associate = (models) => {
        models.Question.belongsTo(models.User);
        models.Question.hasMany(models.Comment);
    };

    return Question;
};
