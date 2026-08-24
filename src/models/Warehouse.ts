import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Warehouse extends Model {
  public id!: string;
  public code!: string;
  public name!: string;
  public address!: string;
}

Warehouse.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'warehouses',
    timestamps: false,
  }
);
