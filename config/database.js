const { Sequelize } = require('sequelize');
const path = require('path');
const sqlitePackage = require('sqlite3');

const sqlite3 = sqlitePackage.default || sqlitePackage;
const sqliteDialectModule = sqlite3.verbose ? sqlite3.verbose() : sqlite3;

function isConstructor(value) {
  if (typeof value !== 'function') {
    return false;
  }

  try {
    Reflect.construct(String, [], value);
    return true;
  } catch {
    return false;
  }
}

if (!isConstructor(sqliteDialectModule.Database)) {
  throw new Error('Driver sqlite3 invalido: Database nao esta disponivel.');
}

const storage = process.env.DATABASE_STORAGE || (
  process.env.NODE_ENV === 'test'
    ? path.join(__dirname, `../database.test-${process.env.VITEST_WORKER_ID || process.pid}.sqlite`)
    : path.join(__dirname, '../database.sqlite')
);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  dialectModule: sqliteDialectModule,
  storage,
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  }
});

module.exports = sequelize;
