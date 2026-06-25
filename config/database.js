const { Sequelize } = require('sequelize');
const path = require('path');
const BetterSqlite3 = require('better-sqlite3');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  dialectModule: BetterSqlite3,
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  }
});

module.exports = sequelize;