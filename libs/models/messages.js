var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
  'messages',
  {
    content: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notEmpty: true
            }
    },
    attachment: {
            type: DataTypes.STRING,
            validate: {
              notEmpty: true
            }
    },
    attachment_type: {
            type: DataTypes.INTEGER,
            defaultValue: 0
    },
    channel_id: {
           type: Sequelize.INTEGER,
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
