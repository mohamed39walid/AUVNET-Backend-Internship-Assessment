'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // One category has many products
      Category.hasMany(models.Product, {
        foreignKey: 'categoryId',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });

      // One category has many subcategories (self-reference)
      Category.hasMany(models.Category, {
        as: 'subcategories',
        foreignKey: 'parent_id',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });

      // One category belongs to a parent category (self-reference)
      Category.belongsTo(models.Category, {
        as: 'parent',
        foreignKey: 'parent_id',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
  }

  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'Categories',
      timestamps: true,
    }
  );

  return Category;
};
