const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class CountersDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const counters = await db.counters.create(
      {
        id: data.id || undefined,

        counter_number: data.counter_number || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await counters.setLogs(data.logs || [], {
      transaction,
    });

    return counters;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const countersData = data.map((item, index) => ({
      id: item.id || undefined,

      counter_number: item.counter_number || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const counters = await db.counters.bulkCreate(countersData, {
      transaction,
    });

    // For each item created, replace relation files

    return counters;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const counters = await db.counters.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.counter_number !== undefined)
      updatePayload.counter_number = data.counter_number;

    updatePayload.updatedById = currentUser.id;

    await counters.update(updatePayload, { transaction });

    if (data.logs !== undefined) {
      await counters.setLogs(data.logs, { transaction });
    }

    return counters;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const counters = await db.counters.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of counters) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of counters) {
        await record.destroy({ transaction });
      }
    });

    return counters;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const counters = await db.counters.findByPk(id, options);

    await counters.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await counters.destroy({
      transaction,
    });

    return counters;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const counters = await db.counters.findOne({ where }, { transaction });

    if (!counters) {
      return counters;
    }

    const output = counters.get({ plain: true });

    output.logs_counter = await counters.getLogs_counter({
      transaction,
    });

    output.logs = await counters.getLogs({
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
        model: db.logs,
        as: 'logs',
        required: false,
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.counter_numberRange) {
        const [start, end] = filter.counter_numberRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            counter_number: {
              ...where.counter_number,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            counter_number: {
              ...where.counter_number,
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

      if (filter.logs) {
        const searchTerms = filter.logs.split('|');

        include = [
          {
            model: db.logs,
            as: 'logs_filter',
            required: searchTerms.length > 0,
            where:
              searchTerms.length > 0
                ? {
                    [Op.or]: [
                      {
                        id: {
                          [Op.in]: searchTerms.map((term) => Utils.uuid(term)),
                        },
                      },
                      {
                        timestamp: {
                          [Op.or]: searchTerms.map((term) => ({
                            [Op.iLike]: `%${term}%`,
                          })),
                        },
                      },
                    ],
                  }
                : undefined,
          },
          ...include,
        ];
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
      const { rows, count } = await db.counters.findAndCountAll(queryOptions);

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
          Utils.ilike('counters', 'counter_number', query),
        ],
      };
    }

    const records = await db.counters.findAll({
      attributes: ['id', 'counter_number'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['counter_number', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.counter_number,
    }));
  }
};
