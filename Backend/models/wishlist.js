'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    static associate(models) {
      // Each wishlist item belongs to one user
      Wishlist.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });

      // Each wishlist item refers to one product
      Wishlist.belongsTo(models.Product, {
        foreignKey: 'productId',
        onDelete: 'CASCADE',
      });
    }
  }

  Wishlist.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // must match the actual table name
          key: 'id',
        },
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Wishlist',
      tableName: 'Wishlists',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['userId', 'productId'], // prevent duplicates
        },
      ],
    }
  );

  return Wishlist;
};
