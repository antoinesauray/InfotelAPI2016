var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
  'channels',
  {
    name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
              notEmpty: true
            }
    },
    avatar: {
              type: DataTypes.STRING,
              validate: {
                notEmpty: true
              }
    }
  },
  {
    define: {
        timestamps: true
    }
  });
};
