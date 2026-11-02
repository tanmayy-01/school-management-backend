'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TeacherClasses', {
      teacher_id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // Mark as primary key for composite key mapping
        allowNull: false,
        references: { model: 'Teachers', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      class_id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // Mark as primary key for composite key mapping
        allowNull: false,
        references: { model: 'Classes', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TeacherClasses');
  }
};