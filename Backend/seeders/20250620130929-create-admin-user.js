'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('admin', 10);
    return queryInterface.bulkInsert('Users', [{
      username: 'admin',
      name: 'Super Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      type: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', { username: 'admin' }, {});
  }
};
