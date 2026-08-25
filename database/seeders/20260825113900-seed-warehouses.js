'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('warehouses', [
      {
        id: '22222222-2222-2222-2222-222222222201',
        code: 'KHO-TONG',
        name: 'Kho Tổng Trung Tâm VIMES',
        address: 'Khu công nghiệp Tân Bình, TP.HCM',
      },
      {
        id: '22222222-2222-2222-2222-222222222202',
        code: 'KHO-VT1',
        name: 'Kho Vật Tư 01 - Cầu Giấy',
        address: 'Quận Cầu Giấy, Hà Nội',
      },
      {
        id: '22222222-2222-2222-2222-222222222203',
        code: 'KHO-TP',
        name: 'Kho Thành Phẩm Dĩ An',
        address: 'TX Dĩ An, Bình Dương',
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('warehouses', null, {});
  }
};
