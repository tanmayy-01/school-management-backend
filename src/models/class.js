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
      // define association here
      Class.belongsTo(models.School, {
        foreignKey: 'school_id',
        as: 'school'
      })
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
