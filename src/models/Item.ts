import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Item extends Model {
  public id!: string;
  public code!: string;
  public name!: string;
  public specifications!: string;
  public unit_id!: string;
}

Item.init(
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
    specifications: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    unit_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'items',
    timestamps: false,
  }
);
