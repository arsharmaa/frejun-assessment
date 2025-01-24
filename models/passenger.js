'use strict';
module.exports = (sequelize, DataTypes) => {
  const Passenger = sequelize.define('Passenger', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },
    age: {
      type: DataTypes.INTEGER
    },
    gender: {
      type: DataTypes.STRING
    },
    isChild: {
      type: DataTypes.BOOLEAN
    },
    isLadyWithChild: {
      type: DataTypes.BOOLEAN
    },
  }, {});

  Passenger.associate = function (models) {
    Passenger.hasOne(models.Ticket, { foreignKey: 'passengerId' });
  };

  return Passenger;
};
