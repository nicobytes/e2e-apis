const request = require('supertest');
const createApp = require('./../src/app');
const { models } = require('./../src/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('Testing for /categories endpoints', () => {

  let app = null;
  let server = null;
  let api = null;
  let accessToken = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(8000);
    api = request(app);
    await upSeed();
  })

  describe('POST /categories', () => {


    beforeAll(async () => {
      const user = await models.User.findByPk('1');
      const loginData = {
        email: user.email,
        password: 'admin123',
      };
      const { body } = await api
        .post('/api/v1/auth/login')
        .send(loginData);
      accessToken = body.access_token;
    });

    test('should return 401', async() => {
      const inputData = {
        name: 'Categoría',
        image: 'https://api.lorem.space/image/game?w=150&h=220'
      }
      const { statusCode } = await api
        .post('/api/v1/categories')
        .send(inputData);
      expect(statusCode).toEqual(401);
    });

    test('should return 200', async() => {
      const inputData = {
        name: 'Categoría',
        image: 'https://api.lorem.space/image/game?w=150&h=220'
      }
      const { statusCode, body } = await api
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(inputData);
      expect(statusCode).toEqual(201);
      // checks DB
      const category = await models.Category.findByPk(body.id);
      expect(category).toBeTruthy();
      expect(body.name).toEqual(category.name);
      expect(body.image).toEqual(category.image);
    });

    afterAll(() => {
      accessToken = null;
    });

  });

  afterAll(async () => {
    await downSeed();
    server.close();
  })
});
