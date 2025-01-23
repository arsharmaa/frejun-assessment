'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WaitingList extends Model {
    static associate(models) {
      WaitingList.belongsTo(models.Ticket, { foreignKey: 'ticketId' });
    }
  }
  WaitingList.init({
    ticketId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'WaitingList',
  });
  return WaitingList;
};
