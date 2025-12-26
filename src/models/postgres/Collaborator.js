const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Collaborator = sequelize.define(
  'Collaborator',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    workspaceId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'workspace_id',
      references: {
        model: 'workspaces',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    role: {
      type: DataTypes.ENUM('Owner', 'Collaborator', 'Viewer'),
      allowNull: false,
      defaultValue: 'Viewer',
    },
  },
  {
    tableName: 'collaborators',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['workspace_id', 'user_id'],
      },
      {
        fields: ['workspace_id'],
      },
      {
        fields: ['user_id'],
      },
    ],
  }
);

module.exports = Collaborator;
