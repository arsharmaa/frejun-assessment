'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Passenger extends Model {
    static associate(models) {
      Passenger.hasOne(models.Ticket, {
        foreignKey: 'passengerId',
        onDelete: 'CASCADE'
      });
    }
  }
  Passenger.init({
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    isChild: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Passenger',
  });
  return Passenger;
};
