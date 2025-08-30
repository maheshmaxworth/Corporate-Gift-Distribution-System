const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const gift_statuses = sequelize.define(
    'gift_statuses',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      status: {
        type: DataTypes.ENUM,

        values: ['NotCollected', 'Collected'],
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

  gift_statuses.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.gift_statuses.hasMany(db.employees, {
      as: 'employees_gift_status',
      foreignKey: {
        name: 'gift_statusId',
      },
      constraints: false,
    });

    //end loop

    db.gift_statuses.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.gift_statuses.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return gift_statuses;
};
