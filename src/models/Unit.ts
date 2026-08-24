import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Unit extends Model {
  public id!: string;
  public code!: string;
  public name!: string;
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
      unique: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'units',
    timestamps: false,
  }
);
