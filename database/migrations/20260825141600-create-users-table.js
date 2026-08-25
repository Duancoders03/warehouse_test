"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      full_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      department: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      role: {
        type: Sequelize.STRING(50),
        allowNull: false,
        enum: ["creator", "keeper", "accountant"],
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
