'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Product, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
      Category.hasMany(models.Category, { as: 'subcategories', foreignKey: 'parent_id' });
      Category.belongsTo(models.Category, { as: 'parent', foreignKey: 'parent_id' });
    }
  }

  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'Categories',
    timestamps: true,
  });

  return Category;
};
