var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
  'conversations',
  {
    user1_id: {
           type: Sequelize.INTEGER,
           unique: 'indexUserUser',
           allowNull: false,
           validate: {
             notEmpty: true
           },
           references: {
             model: 'users',
             key: 'id'
           }
    },
    user2_id: {
           type: Sequelize.INTEGER,
           unique: 'indexUserUser',
           allowNull: false,
           validate: {
             notEmpty: true
           },
           references: {
             model: 'users',
             key: 'id'
           }
    }
  },
  {
    define: {
        timestamps: true
    }
  });
};
