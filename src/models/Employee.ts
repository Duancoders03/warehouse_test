import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Employee extends Model {
  public id!: string;
  public code!: string;
  public full_name!: string;
  public department!: string;
  public role!: 'CREATOR' | 'KEEPER' | 'ACCOUNTANT';
  public warehouse_id!: string;
}

Employee.init(
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
    warehouse_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'employees',
    timestamps: false,
  }
);
