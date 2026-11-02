'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TeacherClass extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Direct relationships back to parent tables (excellent for complex queries or logging)
      TeacherClass.belongsTo(models.Teacher, { foreignKey: 'teacher_id', as: 'teacher' });
      TeacherClass.belongsTo(models.Class, { foreignKey: 'class_id', as: 'class' });
    }
  }

  TeacherClass.init({
    teacher_id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Part 1 of the composite primary key
      allowNull: false,
      references: {
        model: 'Teachers',
        key: 'id'
      }
    },
    class_id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Part 2 of the composite primary key
      allowNull: false,
      references: {
        model: 'Classes',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'TeacherClass',
    tableName: 'TeacherClasses',
  });

  return TeacherClass;
};
