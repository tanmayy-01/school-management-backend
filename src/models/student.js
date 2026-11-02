'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A Student belongs to a specific School
      Student.belongsTo(models.School, {
        foreignKey: 'school_id',
        as: 'school',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // A Student belongs to a specific Class
      Student.belongsTo(models.Class, {
        foreignKey: 'class_id',
        as: 'class',
        onDelete: 'SET NULL', // If a class is deleted, the student record remains but class_id becomes null
        onUpdate: 'CASCADE'
      });
    }
  }

  Student.init({
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
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
      allowNull: true
    },
    school_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Schools',
        key: 'id'
      }
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Classes',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Student',
    tableName: 'Students',
  });

  return Student;
};
