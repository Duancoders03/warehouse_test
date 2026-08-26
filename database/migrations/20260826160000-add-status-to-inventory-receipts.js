'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('inventory_receipts', 'status', {
      type: Sequelize.ENUM('DRAFT', 'PUBLIC', 'CANCEL'),
      allowNull: false,
      defaultValue: 'DRAFT',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('inventory_receipts', 'status');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_inventory_receipts_status";');
  },
};
