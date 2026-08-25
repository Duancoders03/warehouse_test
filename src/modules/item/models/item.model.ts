import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../../config/database';

export interface ItemAttributes {
  id: string;
  code: string;
  name: string;
  specifications?: string;
  unit_id: string;
}

export interface ItemCreationAttributes extends Optional<ItemAttributes, 'id' | 'specifications'> {}

export class Item
  extends Model<ItemAttributes, ItemCreationAttributes>
  implements ItemAttributes
{
  declare id: string;
  declare code: string;
  declare name: string;
  declare specifications: string;
  declare unit_id: string;
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
