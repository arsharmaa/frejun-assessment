'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tickets', 'berthType', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('Tickets', 'seatNumber', {
      type: Sequelize.INTEGER
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tickets', 'berthType');
    await queryInterface.removeColumn('Tickets', 'seatNumber');
  }
};
