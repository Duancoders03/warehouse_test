'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('suppliers', [
      {
        id: '33333333-3333-3333-3333-333333333301',
        code: 'NCC-HOAPAT',
        name: 'Tập đoàn Hòa Phát',
        address: 'KCN Phố Nối A, Hưng Yên',
        tax_code: '0100100101',
      },
      {
        id: '33333333-3333-3333-3333-333333333302',
        code: 'NCC-CADIVI',
        name: 'Công ty Cổ phần Dây cáp điện Việt Nam (CADIVI)',
        address: '70-72 Nam Kỳ Khởi Nghĩa, Q.1, TP.HCM',
        tax_code: '0300381564',
      },
      {
        id: '33333333-3333-3333-3333-333333333303',
        code: 'NCC-SCHNEIDER',
        name: 'Công ty TNHH Schneider Electric Việt Nam',
        address: 'Tầng 16, Ree Tower, Q.4, TP.HCM',
        tax_code: '0301423985',
      },
      {
        id: '33333333-3333-3333-3333-333333333304',
        code: 'NCC-RANGDONG',
        name: 'Công ty Cổ phần Bóng đèn Phích nước Rạng Đông',
        address: '87 Hạ Đình, Thanh Xuân, Hà Nội',
        tax_code: '0100101421',
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('suppliers', null, {});
  }
};
