'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductTag.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product',
      });
    }
  }
  ProductTag.init({
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productTag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'ProductTag',
    tableName: 'productTag'
  });
  return ProductTag;
};