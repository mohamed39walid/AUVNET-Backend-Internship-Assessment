'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
      Product.belongsTo(models.Category, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
      Product.hasMany(models.Wishlist, { foreignKey: 'productId', onDelete: 'CASCADE' });
    }
  }

  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Products',
    timestamps: true,
  });

  return Product;
};
