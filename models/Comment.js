'use strict';

module.exports = (sequelize, DataTypes) => {
    let Comment = sequelize.define('Comment', {
        title: DataTypes.STRING,
        content: DataTypes.TEXT
    });

    Comment.associate = (models) => {
        models.Comment.belongsTo(models.Question);
        models.Comment.belongsTo(models.User);
    };

    return Comment;
};
