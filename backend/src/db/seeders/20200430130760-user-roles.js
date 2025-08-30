const { v4: uuid } = require('uuid');

module.exports = {
  /**
   * @param{import("sequelize").QueryInterface} queryInterface
   * @return {Promise<void>}
   */
  async up(queryInterface) {
    const createdAt = new Date();
    const updatedAt = new Date();

    /** @type {Map<string, string>} */
    const idMap = new Map();

    /**
     * @param {string} key
     * @return {string}
     */
    function getId(key) {
      if (idMap.has(key)) {
        return idMap.get(key);
      }
      const id = uuid();
      idMap.set(key, id);
      return id;
    }

    await queryInterface.bulkInsert('roles', [
      {
        id: getId('Administrator'),
        name: 'Administrator',
        createdAt,
        updatedAt,
      },

      {
        id: getId('EventSupervisor'),
        name: 'Event Supervisor',
        createdAt,
        updatedAt,
      },

      {
        id: getId('GiftCoordinator'),
        name: 'Gift Coordinator',
        createdAt,
        updatedAt,
      },

      {
        id: getId('CounterManager'),
        name: 'Counter Manager',
        createdAt,
        updatedAt,
      },

      {
        id: getId('SystemAnalyst'),
        name: 'System Analyst',
        createdAt,
        updatedAt,
      },

      {
        id: getId('SupportSpecialist'),
        name: 'Support Specialist',
        createdAt,
        updatedAt,
      },

      { id: getId('Public'), name: 'Public', createdAt, updatedAt },
    ]);

    /**
     * @param {string} name
     */
    function createPermissions(name) {
      return [
        {
          id: getId(`CREATE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `CREATE_${name.toUpperCase()}`,
        },
        {
          id: getId(`READ_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `READ_${name.toUpperCase()}`,
        },
        {
          id: getId(`UPDATE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `UPDATE_${name.toUpperCase()}`,
        },
        {
          id: getId(`DELETE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `DELETE_${name.toUpperCase()}`,
        },
      ];
    }

    const entities = [
      'users',
      'counters',
      'employees',
      'gift_statuses',
      'logs',
      'roles',
      'permissions',
      ,
    ];
    await queryInterface.bulkInsert(
      'permissions',
      entities.flatMap(createPermissions),
    );
    await queryInterface.bulkInsert('permissions', [
      {
        id: getId(`READ_API_DOCS`),
        createdAt,
        updatedAt,
        name: `READ_API_DOCS`,
      },
    ]);
    await queryInterface.bulkInsert('permissions', [
      {
        id: getId(`CREATE_SEARCH`),
        createdAt,
        updatedAt,
        name: `CREATE_SEARCH`,
      },
    ]);

    await queryInterface.sequelize
      .query(`create table "rolesPermissionsPermissions"
(
"createdAt"           timestamp with time zone not null,
"updatedAt"           timestamp with time zone not null,
"roles_permissionsId" uuid                     not null,
"permissionId"        uuid                     not null,
primary key ("roles_permissionsId", "permissionId")
);`);

    await queryInterface.bulkInsert('rolesPermissionsPermissions', [
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('EventSupervisor'),
        permissionId: getId('CREATE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('EventSupervisor'),
        permissionId: getId('READ_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('EventSupervisor'),
        permissionId: getId('UPDATE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('EventSupervisor'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('GiftCoordinator'),
        permissionId: getId('READ_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('GiftCoordinator'),
        permissionId: getId('UPDATE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CounterManager'),
        permissionId: getId('READ_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CounterManager'),
        permissionId: getId('UPDATE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SystemAnalyst'),
        permissionId: getId('UPDATE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SupportSpecialist'),
        permissionId: getId('UPDATE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('EventSupervisor'),
        permissionId: getId('CREATE_COUNTERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('EventSupervisor'),
        permissionId: getId('READ_COUNTERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('EventSupervisor'),
        permissionId: getId('UPDATE_COUNTERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('EventSupervisor'),
        permissionId: getId('DELETE_COUNTERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('GiftCoordinator'),
        permissionId: getId('READ_COUNTERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('GiftCoordinator'),
        permissionId: getId('UPDATE_COUNTERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CounterManager'),
        permissionId: getId('READ_COUNTERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CounterManager'),
        permissionId: getId('UPDATE_COUNTERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SystemAnalyst'),
        permissionId: getId('UPDATE_COUNTERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SupportSpecialist'),
        permissionId: getId('UPDATE_COUNTERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('EventSupervisor'),
        permissionId: getId('CREATE_EMPLOYEES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('EventSupervisor'),
        permissionId: getId('READ_EMPLOYEES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('EventSupervisor'),
        permissionId: getId('UPDATE_EMPLOYEES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('EventSupervisor'),
        permissionId: getId('DELETE_EMPLOYEES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('GiftCoordinator'),
        permissionId: getId('READ_EMPLOYEES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('GiftCoordinator'),
        permissionId: getId('UPDATE_EMPLOYEES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CounterManager'),
        permissionId: getId('READ_EMPLOYEES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CounterManager'),
        permissionId: getId('UPDATE_EMPLOYEES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SystemAnalyst'),
        permissionId: getId('UPDATE_EMPLOYEES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SupportSpecialist'),
        permissionId: getId('UPDATE_EMPLOYEES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('EventSupervisor'),
        permissionId: getId('CREATE_GIFT_STATUSES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('EventSupervisor'),
        permissionId: getId('READ_GIFT_STATUSES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('EventSupervisor'),
        permissionId: getId('UPDATE_GIFT_STATUSES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('EventSupervisor'),
        permissionId: getId('DELETE_GIFT_STATUSES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('GiftCoordinator'),
        permissionId: getId('READ_GIFT_STATUSES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('GiftCoordinator'),
        permissionId: getId('UPDATE_GIFT_STATUSES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CounterManager'),
        permissionId: getId('READ_GIFT_STATUSES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CounterManager'),
        permissionId: getId('UPDATE_GIFT_STATUSES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SystemAnalyst'),
        permissionId: getId('UPDATE_GIFT_STATUSES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SupportSpecialist'),
        permissionId: getId('UPDATE_GIFT_STATUSES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('EventSupervisor'),
        permissionId: getId('CREATE_LOGS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('EventSupervisor'),
        permissionId: getId('READ_LOGS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('EventSupervisor'),
        permissionId: getId('UPDATE_LOGS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('EventSupervisor'),
        permissionId: getId('DELETE_LOGS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('GiftCoordinator'),
        permissionId: getId('READ_LOGS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('GiftCoordinator'),
        permissionId: getId('UPDATE_LOGS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CounterManager'),
        permissionId: getId('READ_LOGS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CounterManager'),
        permissionId: getId('UPDATE_LOGS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SystemAnalyst'),
        permissionId: getId('UPDATE_LOGS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SupportSpecialist'),
        permissionId: getId('UPDATE_LOGS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('EventSupervisor'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('GiftCoordinator'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('CounterManager'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SystemAnalyst'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SupportSpecialist'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_COUNTERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_COUNTERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_COUNTERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_COUNTERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_EMPLOYEES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_EMPLOYEES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_EMPLOYEES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_EMPLOYEES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_GIFT_STATUSES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_GIFT_STATUSES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_GIFT_STATUSES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_GIFT_STATUSES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_LOGS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_LOGS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_LOGS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_LOGS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_ROLES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_PERMISSIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_API_DOCS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_SEARCH'),
      },
    ]);

    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'SuperAdmin',
      )}' WHERE "email"='super_admin@flatlogic.com'`,
    );
    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'Administrator',
      )}' WHERE "email"='admin@flatlogic.com'`,
    );

    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'EventSupervisor',
      )}' WHERE "email"='client@hello.com'`,
    );
    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'GiftCoordinator',
      )}' WHERE "email"='john@doe.com'`,
    );
  },
};
