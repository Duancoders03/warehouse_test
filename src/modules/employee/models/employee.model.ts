import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../../config/database';

export interface EmployeeAttributes {
  id: string;
  code: string;
  full_name: string;
  department?: string;
  role: 'CREATOR' | 'KEEPER' | 'ACCOUNTANT';
  warehouse_id?: string;
}

export interface EmployeeCreationAttributes extends Optional<EmployeeAttributes, 'id' | 'department' | 'warehouse_id'> {}

export class Employee
  extends Model<EmployeeAttributes, EmployeeCreationAttributes>
  implements EmployeeAttributes
{
  declare id: string;
  declare code: string;
  declare full_name: string;
  declare department: string;
  declare role: 'CREATOR' | 'KEEPER' | 'ACCOUNTANT';
  declare warehouse_id: string;
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
