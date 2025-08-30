const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Gift_statusesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const gift_statuses = await db.gift_statuses.create(
      {
        id: data.id || undefined,

        status: data.status || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return gift_statuses;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const gift_statusesData = data.map((item, index) => ({
      id: item.id || undefined,

      status: item.status || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const gift_statuses = await db.gift_statuses.bulkCreate(gift_statusesData, {
      transaction,
    });

    // For each item created, replace relation files

    return gift_statuses;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const gift_statuses = await db.gift_statuses.findByPk(
      id,
      {},
      { transaction },
    );

    const updatePayload = {};

    if (data.status !== undefined) updatePayload.status = data.status;

    updatePayload.updatedById = currentUser.id;

    await gift_statuses.update(updatePayload, { transaction });

    return gift_statuses;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const gift_statuses = await db.gift_statuses.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of gift_statuses) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of gift_statuses) {
        await record.destroy({ transaction });
      }
    });

    return gift_statuses;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const gift_statuses = await db.gift_statuses.findByPk(id, options);

    await gift_statuses.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await gift_statuses.destroy({
      transaction,
    });

    return gift_statuses;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const gift_statuses = await db.gift_statuses.findOne(
      { where },
      { transaction },
    );

    if (!gift_statuses) {
      return gift_statuses;
    }

    const output = gift_statuses.get({ plain: true });

    output.employees_gift_status = await gift_statuses.getEmployees_gift_status(
      {
        transaction,
      },
    );

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

    let include = [];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.active !== undefined) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.status) {
        where = {
          ...where,
          status: filter.status,
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
      const { rows, count } = await db.gift_statuses.findAndCountAll(
        queryOptions,
      );

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
          Utils.ilike('gift_statuses', 'status', query),
        ],
      };
    }

    const records = await db.gift_statuses.findAll({
      attributes: ['id', 'status'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['status', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.status,
    }));
  }
};
