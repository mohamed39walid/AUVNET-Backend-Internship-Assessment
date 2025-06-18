'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // 🔐 Add alias 'owner' so you can include { as: 'owner' }
      Product.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'owner',
        onDelete: 'CASCADE',
      });

      // 📂 Add alias 'category' for including category info
      Product.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category',
        onDelete: 'SET NULL',
      });

      // 🧾 Wishlist entries
      Product.hasMany(models.Wishlist, {
        foreignKey: 'productId',
        onDelete: 'CASCADE',
      });
    }
  }

  Product.init(
    {
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
      },
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'Products',
      timestamps: true,
    }
  );

  return Product;
};
