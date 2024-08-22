'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Meeting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Meeting.init({
    meetingProductId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    meetingTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    meetingAdminId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Meeting',
    tableName: 'meeting'
  });
  return Meeting;
};