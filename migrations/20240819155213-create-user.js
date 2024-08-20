'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      userEmail: {
        allowNull: false,
        type: Sequelize.STRING
      },
      userPassword: {
        allowNull: true,
        type: Sequelize.STRING
      },
      userRole: {
        allowNull: false,
        type: Sequelize.STRING
      },
      userTeam: {
        allowNull: true,
        type: Sequelize.STRING
      },
      userAdminId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      isActive: {
        allowNull: false,
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('user');
  }
};