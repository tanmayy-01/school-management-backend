'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Subject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 1. One-to-Many: A Subject belongs to a specific School
      Subject.belongsTo(models.School, {
        foreignKey: 'school_id',
        as: 'school',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // 2. Many-to-Many: Assign Subject to multiple Teachers 
      Subject.belongsToMany(models.Teacher, {
        through: models.TeacherSubject,
        foreignKey: 'subject_id',
        otherKey: 'teacher_id',
        as: 'teachers'
      });

      // 3. Many-to-Many: Assign Subject to multiple Classes 
      Subject.belongsToMany(models.Class, {
        through: models.ClassSubject,
        foreignKey: 'subject_id',
        otherKey: 'class_id',
        as: 'classes'
      });
    }
  }

  Subject.init({
    name: {
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
    modelName: 'Subject',
    tableName: 'Subjects',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['name', 'school_id'] // Prevents duplicate subject names within the same school
      }
    ]
  });

  return Subject;
};
