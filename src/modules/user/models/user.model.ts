import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../../config/database';

export interface UserAttributes {
  id: string;
  code: string;
  full_name: string;
  department?: string;
  role: 'CREATOR' | 'KEEPER' | 'ACCOUNTANT';
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
  declare role: 'CREATOR' | 'KEEPER' | 'ACCOUNTANT';
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
      unique: true,
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['CREATOR', 'KEEPER', 'ACCOUNTANT']],
      },
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false,
  }
);
