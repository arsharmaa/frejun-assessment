'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.STRING
    },
    berthType: {
      type: DataTypes.STRING
    },
    seatNumber: {
      type: DataTypes.INTEGER
    },
    passengerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Passengers',
        key: 'id'
      }
    }
  }, {});

  Ticket.associate = function (models) {
    Ticket.belongsTo(models.Passenger, { foreignKey: 'passengerId' });
    Ticket.hasOne(models.Berth, { foreignKey: 'ticketId', onDelete: 'CASCADE' });
    Ticket.hasOne(models.WaitingList, { foreignKey: 'ticketId', onDelete: 'CASCADE' });
  };

  return Ticket;
};
