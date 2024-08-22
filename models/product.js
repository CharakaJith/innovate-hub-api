'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.hasMany(models.ProductCategory, {
        foreignKey: 'productId',
        as: 'productCategories',
      });

      Product.hasMany(models.ProductTag, {
        foreignKey: 'productId',
        as: 'productTags',
      });

      Product.hasMany(models.ProductMember, {
        foreignKey: 'productId',
        as: 'productMembers',
      });

      Product.hasMany(models.Meeting, {
        foreignKey: 'meetingProductId',
        as: 'productMeetings',
      });

      Product.belongsTo(models.User, {
        foreignKey: 'productAdminId',
        as: 'user',
      });
    }
  }
  Product.init({
    productBrand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productDescription: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productAdminId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'product'
  });
  return Product;
};