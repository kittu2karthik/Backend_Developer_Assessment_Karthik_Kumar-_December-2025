const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: true, // NULL for OAuth users
      field: 'password_hash',
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'full_name',
    },
    oauthProvider: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'oauth_provider',
    },
    oauthId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'oauth_id',
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['email'],
      },
      {
        fields: ['oauth_provider', 'oauth_id'],
      },
    ],
  }
);

module.exports = User;
