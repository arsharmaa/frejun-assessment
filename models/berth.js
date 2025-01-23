'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Berth extends Model {
    static associate(models) {
      Berth.belongsTo(models.Ticket, { foreignKey: 'ticketId' });
    }
  }
  Berth.init({
    type: DataTypes.STRING,
    status: DataTypes.STRING,
    ticketId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Berth',
  });
  return Berth;
};
