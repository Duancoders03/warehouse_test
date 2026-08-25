'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('items', [
      {
        id: '44444444-4444-4444-4444-444444444401',
        code: 'VT-THEP-01',
        name: 'Thép phi 12 Hòa Phát (D12 CB300-V)',
        specifications: 'Đường kính 12mm, chiều dài tiêu chuẩn 11.7m',
        unit_id: '11111111-1111-1111-1111-111111111101', // KG
      },
      {
        id: '44444444-4444-4444-4444-444444444402',
        code: 'VT-CAP-02',
        name: 'Cáp điện CADIVI 2x2.5mm2 (CVV-2x2.5)',
        specifications: 'Cáp điện lực hạ thế 0.6/1kV, ruột đồng cách điện PVC',
        unit_id: '11111111-1111-1111-1111-111111111103', // MET
      },
      {
        id: '44444444-4444-4444-4444-444444444403',
        code: 'VT-CB-03',
        name: 'Aptomat MCB Schneider 2P 32A (EZ9F34232)',
        specifications: 'Dòng định mức 32A, khả năng cắt ngắn mạch 4.5kA',
        unit_id: '11111111-1111-1111-1111-111111111102', // CAI
      },
      {
        id: '44444444-4444-4444-4444-444444444404',
        code: 'VT-DEN-04',
        name: 'Đèn LED Panel Rạng Đông 60x60 50W',
        specifications: 'Kích thước 600x600mm, ánh sáng trắng 6500K',
        unit_id: '11111111-1111-1111-1111-111111111102', // CAI
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('items', null, {});
  }
};
