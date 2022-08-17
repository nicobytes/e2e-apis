module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkInsert('products', [
      {
        name: 'Product 1',
        description: 'bla bla bla',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
        price: 100,
        category_id: 1,
        created_at: new Date(),
      },
      {
        name: 'Product 2',
        description: 'bla bla bla',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
        price: 200,
        category_id: 1,
        created_at: new Date(),
      },
      {
        name: 'Product 3',
        description: 'bla bla bla',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
        price: 300,
        category_id: 2,
        created_at: new Date(),
      },
      {
        name: 'Product 4',
        description: 'bla bla bla',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
        price: 400,
        category_id: 2,
        created_at: new Date(),
      }
    ]);
  },
  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete('products', null);
  }
};
