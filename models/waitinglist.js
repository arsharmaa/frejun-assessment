'use strict';
module.exports = (sequelize, DataTypes) => {
  const WaitingList = sequelize.define('WaitingList', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ticketId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tickets',
        key: 'id'
      }
    }
  }, {});

  WaitingList.associate = function (models) {
    WaitingList.belongsTo(models.Ticket, { foreignKey: 'ticketId' });
  };

  return WaitingList;
};
