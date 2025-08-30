const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class EmployeesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const employees = await db.employees.create(
      {
        id: data.id || undefined,

        employee_id: data.employee_id || null,
        name: data.name || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await employees.setGift_status(data.gift_status || null, {
      transaction,
    });

    return employees;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const employeesData = data.map((item, index) => ({
      id: item.id || undefined,

      employee_id: item.employee_id || null,
      name: item.name || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const employees = await db.employees.bulkCreate(employeesData, {
      transaction,
    });

    // For each item created, replace relation files

    return employees;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const employees = await db.employees.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.employee_id !== undefined)
      updatePayload.employee_id = data.employee_id;

    if (data.name !== undefined) updatePayload.name = data.name;

    updatePayload.updatedById = currentUser.id;

    await employees.update(updatePayload, { transaction });

    if (data.gift_status !== undefined) {
      await employees.setGift_status(
        data.gift_status,

        { transaction },
      );
    }

    return employees;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const employees = await db.employees.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of employees) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of employees) {
        await record.destroy({ transaction });
      }
    });

    return employees;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const employees = await db.employees.findByPk(id, options);

    await employees.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await employees.destroy({
      transaction,
    });

    return employees;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const employees = await db.employees.findOne({ where }, { transaction });

    if (!employees) {
      return employees;
    }

    const output = employees.get({ plain: true });

    output.logs_employee = await employees.getLogs_employee({
      transaction,
    });

    output.gift_status = await employees.getGift_status({
      transaction,
    });

    return output;
  }

  static async findAll(filter, options) {
    const limit = filter.limit || 0;
    let offset = 0;
    let where = {};
    const currentPage = +filter.page;

    offset = currentPage * limit;

    const orderBy = null;

    const transaction = (options && options.transaction) || undefined;

    let include = [
      {
        model: db.gift_statuses,
        as: 'gift_status',

        where: filter.gift_status
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.gift_status
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  status: {
                    [Op.or]: filter.gift_status
                      .split('|')
                      .map((term) => ({ [Op.iLike]: `%${term}%` })),
                  },
                },
              ],
            }
          : {},
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.employee_id) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('employees', 'employee_id', filter.employee_id),
        };
      }

      if (filter.name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('employees', 'name', filter.name),
        };
      }

      if (filter.active !== undefined) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    const queryOptions = {
      where,
      include,
      distinct: true,
      order:
        filter.field && filter.sort
          ? [[filter.field, filter.sort]]
          : [['createdAt', 'desc']],
      transaction: options?.transaction,
      logging: console.log,
    };

    if (!options?.countOnly) {
      queryOptions.limit = limit ? Number(limit) : undefined;
      queryOptions.offset = offset ? Number(offset) : undefined;
    }

    try {
      const { rows, count } = await db.employees.findAndCountAll(queryOptions);

      return {
        rows: options?.countOnly ? [] : rows,
        count: count,
      };
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  static async findAllAutocomplete(query, limit, offset) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('employees', 'name', query),
        ],
      };
    }

    const records = await db.employees.findAll({
      attributes: ['id', 'name'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.name,
    }));
  }
};
