var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
  'private_messages',
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
    conversation_id: {
           type: Sequelize.INTEGER,
           allowNull: false,
           validate: {
             notEmpty: true
           },
           references: {
             model: 'conversations',
             key: 'id'
           }
    },
    sender_id: {
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
