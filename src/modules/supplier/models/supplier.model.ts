import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../../config/database';

export interface SupplierAttributes {
  id: string;
  code: string;
  name: string;
  address?: string;
  tax_code?: string;
}

export type SupplierCreationAttributes = Optional<SupplierAttributes, 'id' | 'tax_code'>;

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
      unique: {
        name: 'suppliers_code_unique',
        msg: 'Mã nhà cung cấp đã tồn tại trong hệ thống',
      },
      validate: {
        notEmpty: {
          msg: 'Mã nhà cung cấp không được để trống',
        },
        len: {
          args: [2, 50],
          msg: 'Mã nhà cung cấp phải có độ dài từ 2 đến 50 ký tự',
        },
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Tên nhà cung cấp không được để trống',
        },
        len: {
          args: [2, 255],
          msg: 'Tên nhà cung cấp phải có độ dài từ 2 đến 255 ký tự',
        },
      },
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Địa chỉ không được để trống',
        },
        len: {
          args: [2, 255],
          msg: 'Địa chỉ phải có độ dài từ 2 đến 255 ký tự',
        },
      },
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
