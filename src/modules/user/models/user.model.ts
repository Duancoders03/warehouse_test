import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../../config/database';

export interface UserAttributes {
  id: string;
  code: string;
  full_name: string;
  department?: string;
  role: 'creator' | 'keeper' | 'accountant';
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'department'> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: string;
  declare code: string;
  declare full_name: string;
  declare department: string;
  declare role: 'creator' | 'keeper' | 'accountant';
}

User.init(
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
        name: "unique_code",
        msg: "Mã người dùng đã tồn tại",
      },
      validate: {
        notEmpty: {
          msg: 'Mã người dùng không được để trống',
        },
        len: {
          args: [2, 50],
          msg: 'Mã người dùng phải có độ dài từ 2 đến 50 ký tự',
        },
      },
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        name: "unique_full_name",
        msg: "Họ và tên người dùng đã tồn tại",
      },
      validate: {
        notEmpty: {
          msg: 'Họ và tên người dùng không được để trống',
        },
        len: {
          args: [2, 100],
          msg: 'Họ và tên người dùng phải có độ dài từ 2 đến 100 ký tự',
        },
      },
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: 'Tên phòng ban không được vượt quá 100 ký tự',
        },
      },
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Vai trò người dùng không được để trống',
        },
        isIn: {
          args: [['creator', 'keeper', 'accountant']],
          msg: 'Vai trò người dùng phải là creator, keeper hoặc accountant',
        },
      },
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false,
  }
);
