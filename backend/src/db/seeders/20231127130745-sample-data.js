const db = require('../models');
const Users = db.users;

const Counters = db.counters;

const Employees = db.employees;

const GiftStatuses = db.gift_statuses;

const Logs = db.logs;

const CountersData = [
  {
    counter_number: 1,

    // type code here for "relation_many" field
  },

  {
    counter_number: 2,

    // type code here for "relation_many" field
  },

  {
    counter_number: 3,

    // type code here for "relation_many" field
  },
];

const EmployeesData = [
  {
    employee_id: 'E001',

    name: 'John Doe',

    // type code here for "relation_one" field
  },

  {
    employee_id: 'E002',

    name: 'Jane Smith',

    // type code here for "relation_one" field
  },

  {
    employee_id: 'E003',

    name: 'Alice Johnson',

    // type code here for "relation_one" field
  },
];

const GiftStatusesData = [
  {
    status: 'NotCollected',
  },

  {
    status: 'Collected',
  },

  {
    status: 'Collected',
  },
];

const LogsData = [
  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    timestamp: new Date('2023-10-01T10:00:00Z'),
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    timestamp: new Date('2023-10-01T10:05:00Z'),
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    timestamp: new Date('2023-10-01T10:10:00Z'),
  },
];

// Similar logic for "relation_many"

// Similar logic for "relation_many"

async function associateEmployeeWithGift_status() {
  const relatedGift_status0 = await GiftStatuses.findOne({
    offset: Math.floor(Math.random() * (await GiftStatuses.count())),
  });
  const Employee0 = await Employees.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Employee0?.setGift_status) {
    await Employee0.setGift_status(relatedGift_status0);
  }

  const relatedGift_status1 = await GiftStatuses.findOne({
    offset: Math.floor(Math.random() * (await GiftStatuses.count())),
  });
  const Employee1 = await Employees.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Employee1?.setGift_status) {
    await Employee1.setGift_status(relatedGift_status1);
  }

  const relatedGift_status2 = await GiftStatuses.findOne({
    offset: Math.floor(Math.random() * (await GiftStatuses.count())),
  });
  const Employee2 = await Employees.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Employee2?.setGift_status) {
    await Employee2.setGift_status(relatedGift_status2);
  }
}

async function associateLogWithEmployee() {
  const relatedEmployee0 = await Employees.findOne({
    offset: Math.floor(Math.random() * (await Employees.count())),
  });
  const Log0 = await Logs.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Log0?.setEmployee) {
    await Log0.setEmployee(relatedEmployee0);
  }

  const relatedEmployee1 = await Employees.findOne({
    offset: Math.floor(Math.random() * (await Employees.count())),
  });
  const Log1 = await Logs.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Log1?.setEmployee) {
    await Log1.setEmployee(relatedEmployee1);
  }

  const relatedEmployee2 = await Employees.findOne({
    offset: Math.floor(Math.random() * (await Employees.count())),
  });
  const Log2 = await Logs.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Log2?.setEmployee) {
    await Log2.setEmployee(relatedEmployee2);
  }
}

async function associateLogWithCounter() {
  const relatedCounter0 = await Counters.findOne({
    offset: Math.floor(Math.random() * (await Counters.count())),
  });
  const Log0 = await Logs.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Log0?.setCounter) {
    await Log0.setCounter(relatedCounter0);
  }

  const relatedCounter1 = await Counters.findOne({
    offset: Math.floor(Math.random() * (await Counters.count())),
  });
  const Log1 = await Logs.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Log1?.setCounter) {
    await Log1.setCounter(relatedCounter1);
  }

  const relatedCounter2 = await Counters.findOne({
    offset: Math.floor(Math.random() * (await Counters.count())),
  });
  const Log2 = await Logs.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Log2?.setCounter) {
    await Log2.setCounter(relatedCounter2);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Counters.bulkCreate(CountersData);

    await Employees.bulkCreate(EmployeesData);

    await GiftStatuses.bulkCreate(GiftStatusesData);

    await Logs.bulkCreate(LogsData);

    await Promise.all([
      // Similar logic for "relation_many"

      // Similar logic for "relation_many"

      await associateEmployeeWithGift_status(),

      await associateLogWithEmployee(),

      await associateLogWithCounter(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('counters', null, {});

    await queryInterface.bulkDelete('employees', null, {});

    await queryInterface.bulkDelete('gift_statuses', null, {});

    await queryInterface.bulkDelete('logs', null, {});
  },
};
