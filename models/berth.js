'use strict';
module.exports = (sequelize, DataTypes) => {
  const Berth = sequelize.define('Berth', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    type: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING
    },
    seatNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    ticketId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tickets',
        key: 'id'
      }
    }
  }, {});

  Berth.associate = function (models) {
    Berth.belongsTo(models.Ticket, { foreignKey: 'ticketId' });
  };

  return Berth;
};
