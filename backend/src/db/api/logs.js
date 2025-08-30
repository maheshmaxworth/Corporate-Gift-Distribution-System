const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class LogsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const logs = await db.logs.create(
      {
        id: data.id || undefined,

        timestamp: data.timestamp || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await logs.setEmployee(data.employee || null, {
      transaction,
    });

    await logs.setCounter(data.counter || null, {
      transaction,
    });

    return logs;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const logsData = data.map((item, index) => ({
      id: item.id || undefined,

      timestamp: item.timestamp || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const logs = await db.logs.bulkCreate(logsData, { transaction });

    // For each item created, replace relation files

    return logs;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const logs = await db.logs.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.timestamp !== undefined) updatePayload.timestamp = data.timestamp;

    updatePayload.updatedById = currentUser.id;

    await logs.update(updatePayload, { transaction });

    if (data.employee !== undefined) {
      await logs.setEmployee(
        data.employee,

        { transaction },
      );
    }

    if (data.counter !== undefined) {
      await logs.setCounter(
        data.counter,

        { transaction },
      );
    }

    return logs;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const logs = await db.logs.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of logs) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of logs) {
        await record.destroy({ transaction });
      }
    });

    return logs;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const logs = await db.logs.findByPk(id, options);

    await logs.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await logs.destroy({
      transaction,
    });

    return logs;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const logs = await db.logs.findOne({ where }, { transaction });

    if (!logs) {
      return logs;
    }

    const output = logs.get({ plain: true });

    output.employee = await logs.getEmployee({
      transaction,
    });

    output.counter = await logs.getCounter({
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
        model: db.employees,
        as: 'employee',

        where: filter.employee
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.employee
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  name: {
                    [Op.or]: filter.employee
                      .split('|')
                      .map((term) => ({ [Op.iLike]: `%${term}%` })),
                  },
                },
              ],
            }
          : {},
      },

      {
        model: db.counters,
        as: 'counter',

        where: filter.counter
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.counter
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  counter_number: {
                    [Op.or]: filter.counter
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

      if (filter.timestampRange) {
        const [start, end] = filter.timestampRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            timestamp: {
              ...where.timestamp,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            timestamp: {
              ...where.timestamp,
              [Op.lte]: end,
            },
          };
        }
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
      const { rows, count } = await db.logs.findAndCountAll(queryOptions);

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
          Utils.ilike('logs', 'timestamp', query),
        ],
      };
    }

    const records = await db.logs.findAll({
      attributes: ['id', 'timestamp'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['timestamp', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.timestamp,
    }));
  }
};
