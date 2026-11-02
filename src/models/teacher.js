'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 1. One-to-Many: A Teacher belongs to a specific School
      Teacher.belongsTo(models.School, {
        foreignKey: 'school_id',
        as: 'school',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // 2. Many-to-Many: Assign Teacher to multiple Classes
      Teacher.belongsToMany(models.Class, {
        through: models.TeacherClass,
        foreignKey: 'teacher_id',
        otherKey: 'class_id',
        as: 'classes'
      });

      // 3. Many-to-Many: Assign Subject to Teacher 
      Teacher.belongsToMany(models.Subject, {
        through: models.TeacherSubject,
        foreignKey: 'teacher_id',
        otherKey: 'subject_id',
        as: 'subjects'
      });
    }
  }

  Teacher.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mobile_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    school_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Schools',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Teacher',
    tableName: 'Teachers',
  });

  return Teacher;
};
