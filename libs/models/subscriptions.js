var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
  'subscriptions',
  {
    channel_id: {
           type: Sequelize.INTEGER,
           unique: 'indexChannelUser',
           allowNull: false,
           validate: {
             notEmpty: true
           },
           references: {
             model: 'channels',
             key: 'id'
           }
    },
    user_id: {
           type: Sequelize.INTEGER,
           unique: 'indexChannelUser',
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
