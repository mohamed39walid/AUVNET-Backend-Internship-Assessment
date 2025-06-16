'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Associations
     */
    static associate(models) {
      // A user can create many products
      User.hasMany(models.Product, { foreignKey: 'userId', onDelete: 'CASCADE' });

      // A user can have many wishlist items
      User.hasMany(models.Wishlist, { foreignKey: 'userId', onDelete: 'CASCADE' });
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user', // can be 'user' or 'admin'
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',  // optional but recommended for clarity
    timestamps: true     // createdAt / updatedAt
  });

  return User;
};
