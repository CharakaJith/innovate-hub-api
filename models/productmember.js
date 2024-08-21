'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductMember.belongsTo(models.User, {
        foreignKey: 'productMemberId',
        as: 'user',  
      });

      ProductMember.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product',
      });
    }
  }
  ProductMember.init({
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productMemberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'ProductMember',
    tableName: 'productMember'
  });
  return ProductMember;
};