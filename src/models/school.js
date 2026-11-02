"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class School extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // One-to-Many: A School has many Classes
      School.hasMany(models.Class, {
        foreignKey: 'school_id',
        as: 'classes',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // One-to-Many: A School has many Students 
      School.hasMany(models.Student, {
        foreignKey: 'school_id',
        as: 'students',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // One-to-Many: A School has many Teachers 
      School.hasMany(models.Teacher, {
        foreignKey: 'school_id',
        as: 'teachers',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // One-to-Many: A School has many Subjects 
      School.hasMany(models.Subject, {
        foreignKey: 'school_id',
        as: 'subjects',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  School.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      mobile_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "School",
      tableName: "Schools"
    },
  );
  return School;
};
