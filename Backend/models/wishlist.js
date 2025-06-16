'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    static associate(models) {
      Wishlist.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
      Wishlist.belongsTo(models.Product, { foreignKey: 'productId', onDelete: 'CASCADE' });
    }
  }

  Wishlist.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Wishlist',
    tableName: 'Wishlists',
    timestamps: true,
  });

  return Wishlist;
};
