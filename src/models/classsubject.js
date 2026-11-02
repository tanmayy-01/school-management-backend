'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ClassSubject extends Model {
    static associate(models) {
      ClassSubject.belongsTo(models.Class, { foreignKey: 'class_id', as: 'class' });
      ClassSubject.belongsTo(models.Subject, { foreignKey: 'subject_id', as: 'subject' });
    }
  }

  ClassSubject.init({
    class_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'Classes',
        key: 'id'
      }
    },
    subject_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'Subjects',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'ClassSubject',
    tableName: 'ClassSubjects',
  });

  return ClassSubject;
};

