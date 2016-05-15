var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
  'inscriptions',
  {
    event_id: {
           type: Sequelize.INTEGER,
           unique: 'indexEventUser',
           allowNull: false,
           validate: {
             notEmpty: true
           },
           references: {
             model: 'events',
             key: 'id'
           }
    },
    user_id: {
           type: Sequelize.INTEGER,
           unique: 'indexEventUser',
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
