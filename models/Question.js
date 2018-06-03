'use strict';

module.exports = (sequelize, DataTypes) => {
    let Question = sequelize.define('Question', {
        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        urlname: DataTypes.STRING,
        resolvedAt: DataTypes.DATE
    });

    Question.associate = (models) => {
        models.Question.belongsTo(models.User);
        models.Question.hasMany(models.Comment, { onDelete: 'cascade' });
    };

    return Question;
};
