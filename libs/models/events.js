var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
  'events',
  {
    name: {
            type: DataTypes.STRING,
            validate: {
              notEmpty: true
            }
    },
    type: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
              notEmpty: true
            }
    },
    avatar: {
              type: DataTypes.STRING,
              validate: {
                notEmpty: true
              }
    },
    date_start: {
            type: DataTypes.STRING,
            validate: {
              notEmpty: true
            }
    },
    date_end: {
            type: DataTypes.STRING,
            validate: {
              notEmpty: true
            }
    },
    place_lon_start: {
            type: DataTypes.FLOAT,
            validate: {
              notEmpty: true
            }
    },
    place_lat_start: {
            type: DataTypes.FLOAT,
            validate: {
              notEmpty: true
            }
    },
    place_lon_end: {
            type: DataTypes.FLOAT,
            validate: {
              notEmpty: true
            }
    },
    place_lat_end: {
            type: DataTypes.FLOAT,
            validate: {
              notEmpty: true
            }
    },
    nb_person_max: {
            type: DataTypes.INTEGER,
            validate: {
              notEmpty: true
            }
    },
    creator_id: {
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
