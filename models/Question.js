'use strict';

module.exports = (sequelize, DataTypes) => {
    let Question = sequelize.define('Question', {
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        urlname: DataTypes.STRING,
        resolvedAt: DataTypes.DATE
    });

    Question.associate = (models) => {
        models.Question.belongsTo(models.User);
        models.Question.hasMany(models.Comment);
    };

    return Question;
};
