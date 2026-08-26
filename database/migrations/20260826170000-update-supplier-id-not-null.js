"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("inventory_receipts", "supplier_id", {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "suppliers",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("inventory_receipts", "supplier_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "suppliers",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },
};
