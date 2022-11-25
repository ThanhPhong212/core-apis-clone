'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
      { id: 2, value: 'CUSTOMER', active: true },
    ], {})

    await queryInterface.bulkInsert('users', [
      { userName: 'admin', password: 'Admin@123', firstName: 'firstName', lastName: 'lastName', updatedAt: new Date(), roleId: 1 },
    ], {})

  },

  async down(queryInterface, Sequelize) {
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
