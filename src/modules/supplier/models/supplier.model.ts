import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database';

export class Supplier extends Model {
  public id!: string;
  public code!: string;
  public name!: string;
  public address!: string;
  public tax_code!: string;
}

Supplier.init(
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
    tax_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'suppliers',
    timestamps: false,
  }
);
