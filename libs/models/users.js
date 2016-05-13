var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
  'users',
  {
    firstname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notEmpty: true
            }
    },
    lastname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notEmpty: true
            }
    },
    mail: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
              notEmpty: true,
              isEmail: true
            }
    },
    password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notEmpty: true
            }
    },
    token: {
            type: DataTypes.STRING,
            defaultValue: ""
    }
  },
  {
    define: {
        timestamps: true
    }
  });
};
