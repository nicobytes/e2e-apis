const { Sequelize } = require('sequelize');

const { config } = require('../config/config');
const setupModels = require('./models');

const options = {
  dialect: 'postgres',
  logging: config.isProd || config.env === 'e2e' ? false : console.log
}

if (config.isProd) {
  options.dialectOptions = {
    ssl: {
      rejectUnauthorized: false
    }
  }
}

console.log('dbUrl===', config.dbUrl);
const sequelize = new Sequelize(config.dbUrl, options);

setupModels(sequelize);

module.exports = sequelize;
