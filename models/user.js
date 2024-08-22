'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.ProductMember, {
        foreignKey: 'productMemberId',
        as: 'productMembers',
      });

      User.hasMany(models.Product, {
        foreignKey: 'productAdminId',
        as: 'products',
      });

      User.hasMany(models.Meeting, {
        foreignKey: 'meetingAdminId',
        as: 'meetingAdmin',
      });
    }
  }
  User.init({
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userPassword: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userRole: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userTeam: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userAdminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },    
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user'
  });
  return User;
};