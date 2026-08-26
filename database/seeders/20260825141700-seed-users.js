"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: "33333333-3333-3333-3333-333333333301",
          code: "NV-001",
          full_name: "Nguyễn Văn Lập (Kế Toán Kho)",
          department: "Phòng Kế Toán",
          role: "creator",
        },
        {
          id: "33333333-3333-3333-3333-333333333302",
          code: "NV-002",
          full_name: "Trần Thị Thu (Kế Toán Trưởng)",
          department: "Phòng Kế Toán",
          role: "accountant",
        },
        {
          id: "33333333-3333-3333-3333-333333333303",
          code: "NV-003",
          full_name: "Lê Văn Khoa (Thủ Kho)",
          department: "Ban Quản Lý Kho",
          role: "keeper",
        },
        {
          id: "33333333-3333-3333-3333-333333333304",
          code: "NV-004",
          full_name: "Phạm Minh Tuấn (Thủ Kho)",
          department: "Ban Quản Lý Kho",
          role: "keeper",
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
