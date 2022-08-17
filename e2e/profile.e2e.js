const request = require('supertest');
const createApp = require('./../src/app');
const { models } = require('./../src/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('Testing for /profile endpoints', () => {
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

  describe('GET /my-user with admin user', () => {

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

    test('should return 401', async () => {
      const { statusCode } = await api.get('/api/v1/profile/my-user');
      expect(statusCode).toEqual(401);
    });

    test('should return 200', async () => {
      const user = await models.User.findByPk('1');
      const { statusCode, body } = await api
        .get('/api/v1/profile/my-user')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(statusCode).toEqual(200);
      expect(body.email).toEqual(user.email);
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
