"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // One-to-Many: A Class belongs to a single School
      Class.belongsTo(models.School, {
        foreignKey: 'school_id',
        as: 'school',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // One-to-Many: A Class has many Students 
      Class.hasMany(models.Student, {
        foreignKey: 'class_id',
        as: 'students'
      });

      // Many-to-Many: A Class can have multiple Teachers assigned to it 
      // Uses the junction table 'TeacherClasses'
      Class.belongsToMany(models.Teacher, {
        through: models.TeacherClass,
        foreignKey: 'class_id',
        otherKey: 'teacher_id',
        as: 'teachers'
      });

      // Many-to-Many: A Class can have multiple Subjects assigned to it
      // Uses the junction table 'ClassSubjects'
      Class.belongsToMany(models.Subject, {
        through: models.ClassSubject,
        foreignKey: 'class_id',
        otherKey: 'subject_id',
        as: 'subjects'
      });
    }

  }
  Class.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      school_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Schools",
          key: "id"
        },
      },
    },
    {
      sequelize,
      modelName: "Class",
      tableName: "Classes",
      indexes: [
        {
          unique: true,
          fields: ['name', 'school_id']
        }
      ]
    },
  );
  return Class;
};
