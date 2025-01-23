'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    static associate(models) {
      Ticket.belongsTo(models.Passenger, { foreignKey: 'passengerId' });
      Ticket.hasOne(models.Berth, { foreignKey: 'ticketId', onDelete: 'CASCADE' });
      Ticket.hasOne(models.WaitingList, { foreignKey: 'ticketId', onDelete: 'CASCADE' });
    }
  }
  Ticket.init({
    status: DataTypes.STRING,
    berthType: DataTypes.STRING,
    passengerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ticket',
  });
  return Ticket;
};
