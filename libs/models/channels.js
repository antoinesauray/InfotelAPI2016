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
    }
  },
  {
    define: {
        timestamps: true
    }
  });
};
