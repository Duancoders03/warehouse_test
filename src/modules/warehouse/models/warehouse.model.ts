import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../../config/database';

export interface WarehouseAttributes {
  id: string;
  code: string;
  name: string;
  address: string;
}

// Optional fields for creation
export interface WarehouseCreationAttributes extends Optional<WarehouseAttributes, 'id' > {}

// Extend Model take mothods(find, findByPk, create, update, delete), while implements check data for validate (not empty, length, unique) of typescript
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
      unique: {
        name: 'unique_code',
        msg: 'Mã kho đã tồn tại'
      },
      validate: {
        notEmpty: {
          msg: 'Mã kho không được để trống'
        },
        len: {
          args: [2, 50],
          msg: 'Mã kho phải có độ dài từ 2 đến 50 ký tự'
        }
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        name: 'unique_name',
        msg: 'Tên kho đã tồn tại'
      },
      validate: {
        notEmpty: {
          msg: 'Tên kho không được để trống'
        },
        len: {
          args: [2, 255],
          msg: 'Tên kho phải có độ dài từ 2 đến 255 ký tự'
        }
      }
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Địa chỉ kho không được để trống'
        }
      }
    },
  },
  {
    sequelize,
    tableName: 'warehouses',
    timestamps: false,
  }
);
