import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../../config/database';

export interface SupplierAttributes {
  id: string;
  code: string;
  name: string;
  address?: string;
  tax_code?: string;
}

export interface SupplierCreationAttributes extends Optional<SupplierAttributes, 'id' | 'address' | 'tax_code'> {}

export class Supplier
  extends Model<SupplierAttributes, SupplierCreationAttributes>
  implements SupplierAttributes
{
  declare id: string;
  declare code: string;
  declare name: string;
  declare address: string;
  declare tax_code: string;
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
