const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    return queryInterface.bulkInsert('users', [
      {
        email: 'admin@mail.com',
        password: hash,
        role: 'admin',
        created_at: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete('users', null);
  },
};
