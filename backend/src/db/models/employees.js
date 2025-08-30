const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const employees = sequelize.define(
    'employees',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      employee_id: {
        type: DataTypes.TEXT,
      },

      name: {
        type: DataTypes.TEXT,
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

  employees.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.employees.hasMany(db.logs, {
      as: 'logs_employee',
      foreignKey: {
        name: 'employeeId',
      },
      constraints: false,
    });

    //end loop

    db.employees.belongsTo(db.gift_statuses, {
      as: 'gift_status',
      foreignKey: {
        name: 'gift_statusId',
      },
      constraints: false,
    });

    db.employees.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.employees.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return employees;
};
