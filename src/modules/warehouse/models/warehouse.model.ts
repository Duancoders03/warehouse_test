import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../../config/database';

export interface WarehouseAttributes {
  id: string;
  code: string;
  name: string;
  address?: string;
}

export interface WarehouseCreationAttributes extends Optional<WarehouseAttributes, 'id' | 'address'> {}

export class Warehouse
  extends Model<WarehouseAttributes, WarehouseCreationAttributes>
  implements WarehouseAttributes
{
  declare id: string;
  declare code: string;
  declare name: string;
  declare address: string;
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
