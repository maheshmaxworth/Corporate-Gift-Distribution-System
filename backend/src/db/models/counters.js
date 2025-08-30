const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const counters = sequelize.define(
    'counters',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      counter_number: {
        type: DataTypes.INTEGER,
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

  counters.associate = (db) => {
    db.counters.belongsToMany(db.logs, {
      as: 'logs',
      foreignKey: {
        name: 'counters_logsId',
      },
      constraints: false,
      through: 'countersLogsLogs',
    });

    db.counters.belongsToMany(db.logs, {
      as: 'logs_filter',
      foreignKey: {
        name: 'counters_logsId',
      },
      constraints: false,
      through: 'countersLogsLogs',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.counters.hasMany(db.logs, {
      as: 'logs_counter',
      foreignKey: {
        name: 'counterId',
      },
      constraints: false,
    });

    //end loop

    db.counters.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.counters.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return counters;
};
