'use strict';
const dotenv = require('dotenv').config();
const bcrypt = require('bcrypt');
const { USER_ROLE } = require('../enum/user');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // hash password
    const encryptedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    return queryInterface.bulkInsert('user', [{
      userName: process.env.ADMIN_NAME,
      userEmail: process.env.ADMIN_EMAIL,
      userPassword: encryptedPassword,
      userRole: USER_ROLE.SUPER_ADMIN,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
