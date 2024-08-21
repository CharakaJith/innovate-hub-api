'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductCategory.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product',
      });
    }
  }
  ProductCategory.init({
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productCategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'ProductCategory',
    tableName: 'productCategory'
  });
  return ProductCategory;
};