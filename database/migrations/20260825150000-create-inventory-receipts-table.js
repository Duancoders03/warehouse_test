"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("inventory_receipts", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      receipt_no: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      receipt_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      original_document_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      original_document_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      deliverer_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      supplier_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "suppliers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      warehouse_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "warehouses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      debit_account: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      credit_account: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      total_amount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },
      created_by_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      keeper_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      accountant_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("inventory_receipts");
  },
};
