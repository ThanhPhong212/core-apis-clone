'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('roles', [
      { id: 1, value: 'ADMIN', active: true },
      { id: 2, value: 'INVESTMENT_DIRECTOR', active: true },
      { id: 3, value: 'INVESTMENT_STAFF', active: true }
    ],{})

    await queryInterface.bulkInsert('users', [
      { user_name: 'admin', password: 'Admin@123', first_name: 'firstName', last_name: 'lastName', updated_at: new Date(), role_id: 1 },
    ],{})

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  }
};
