const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const SnackContribution = sequelize.define('SnackContribution', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  item: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Item não pode estar vazio'
      }
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Data não pode estar vazia'
      },
      isDate: true
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'snack_contributions'
});

User.hasMany(SnackContribution, { foreignKey: 'userId' });
SnackContribution.belongsTo(User, { foreignKey: 'userId' });

module.exports = SnackContribution;