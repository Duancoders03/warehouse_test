'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('units', [
      { id: '11111111-1111-1111-1111-111111111101', code: 'KG', name: 'Kilôgam' },
      { id: '11111111-1111-1111-1111-111111111102', code: 'CAI', name: 'Cái' },
      { id: '11111111-1111-1111-1111-111111111103', code: 'MET', name: 'Mét' },
      { id: '11111111-1111-1111-1111-111111111104', code: 'THUNG', name: 'Thùng' },
      { id: '11111111-1111-1111-1111-111111111105', code: 'BO', name: 'Bộ' },
      { id: '11111111-1111-1111-1111-111111111106', code: 'CUON', name: 'Cuộn' },
      { id: '11111111-1111-1111-1111-111111111107', code: 'TAN', name: 'Tấn' },
      { id: '11111111-1111-1111-1111-111111111108', code: 'HOP', name: 'Hộp' },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('units', null, {});
  }
};
