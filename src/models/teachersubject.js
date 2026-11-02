'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TeacherSubject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Direct relationships back to the parent tables (useful for reporting/logging)
      TeacherSubject.belongsTo(models.Teacher, { foreignKey: 'teacher_id', as: 'teacher' });
      TeacherSubject.belongsTo(models.Subject, { foreignKey: 'subject_id', as: 'subject' });
    }
  }

  TeacherSubject.init({
    teacher_id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Forms half of your composite primary key
      allowNull: false,
      references: {
        model: 'Teachers',
        key: 'id'
      }
    },
    subject_id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Forms the other half of your composite primary key
      allowNull: false,
      references: {
        model: 'Subjects',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'TeacherSubject',
    tableName: 'TeacherSubjects',
  });

  return TeacherSubject;
};
