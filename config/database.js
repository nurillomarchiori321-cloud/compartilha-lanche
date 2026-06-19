const { Sequelize } = require('sequelize');
const path = require('path');

const isTest = process.env.NODE_ENV === 'test';
const testDbId = process.env.VITEST_POOL_ID || process.env.VITEST_WORKER_ID || process.pid;

const storage = isTest
  ? path.join(__dirname, `../database.test-${testDbId}.sqlite`)
  : path.join(__dirname, '../database.sqlite');

const sequelize = global.__compartilhaSequelize || new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  }
});

global.__compartilhaSequelize = sequelize;

module.exports = sequelize;
