var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
  'users',
  {
    firstname: {
            type: DataTypes.STRING,
            allowNull: false
    },
    lastname: {
            type: DataTypes.STRING,
            allowNull: false
    },
    mail: {
            type: DataTypes.STRING,
            allowNull: false
    },
    password: {
            type: DataTypes.STRING,
            allowNull: false
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
