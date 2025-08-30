const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const logs = sequelize.define(
    'logs',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      timestamp: {
        type: DataTypes.DATE,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  logs.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.logs.belongsTo(db.employees, {
      as: 'employee',
      foreignKey: {
        name: 'employeeId',
      },
      constraints: false,
    });

    db.logs.belongsTo(db.counters, {
      as: 'counter',
      foreignKey: {
        name: 'counterId',
      },
      constraints: false,
    });

    db.logs.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.logs.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return logs;
};
