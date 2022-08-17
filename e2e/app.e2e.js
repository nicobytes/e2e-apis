const request = require('supertest');
const createApp = require('./../src/app');
const { config } = require('./../src/config/config');

describe('Testing for app endpoints', () => {

  let app = null;
  let server = null;
  let api = null;

  beforeAll(() => {
    app = createApp();
    server = app.listen(8000);
    api = request(app);
  })

  describe('GET /hello', () => {
    test('should return a json', async() => {
      const response = await api.get('/hello');
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.statusCode).toEqual(200);
      expect(response.body.name).toEqual('john');
    });
  })

  describe('GET /nueva-ruta', () => {
    test('should return 401', async() => {
      const { statusCode } = await api.get('/nueva-ruta').set({ 'api': '12' });
      expect(statusCode).toEqual(401);
    });
    test('should return 200', async() => {
      const { statusCode } = await api.get('/nueva-ruta').set({ 'api': config.apiKey });
      expect(statusCode).toEqual(200);
    });
  })
  afterAll(() => {
    server.close();
  })
});
