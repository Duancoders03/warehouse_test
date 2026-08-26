import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../../config/database';

export interface UnitAttributes {
  id: string;
  code: string;
  name: string;
}

export interface UnitCreationAttributes extends Optional<UnitAttributes, 'id'> {}

export class Unit
  extends Model<UnitAttributes, UnitCreationAttributes>
  implements UnitAttributes
{
  declare id: string;
  declare code: string;
  declare name: string;
}

Unit.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Mã đơn vị không được để trống',
        },
        len: {
          args: [2, 15],
          msg: 'Mã đơn vị phải có độ dài từ 2 đến 15 ký tự',
        },
        isAlphanumeric: {
          msg: 'Mã đơn vị chỉ được chứa ký tự chữ và số',
        },
      },
      unique: {
        name: 'unique_code',
        msg: 'Mã đơn vị đã tồn tại',
      },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Tên đơn vị không được để trống',
        },
        len: {
          args: [2, 100],
          msg: 'Tên đơn vị phải có độ dài từ 2 đến 100 ký tự',
        },
      },
      unique: {
        name: 'unique_name',
        msg: 'Tên đơn vị đã tồn tại',
      },
    },
  },
  {
    sequelize,
    tableName: 'units',
    timestamps: false,
  }
);
