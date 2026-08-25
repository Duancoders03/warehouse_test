import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../../config/database';
import { Unit } from '../../unit/models/unit.model';

export interface ItemAttributes {
  id: string;
  code: string;
  name: string;
  specifications?: string;
  unit_id: string;
}

export type ItemCreationAttributes = Optional<ItemAttributes, 'id' | 'specifications'>;

export class Item
  extends Model<ItemAttributes, ItemCreationAttributes>
  implements ItemAttributes
{
  declare id: string;
  declare code: string;
  declare name: string;
  declare specifications: string;
  declare unit_id: string;

  declare unit?: Unit;
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
      unique: {
        name: 'items_code_unique',
        msg: 'Mã vật tư đã tồn tại trong hệ thống',
      },
      validate: {
        notEmpty: {
          msg: 'Mã vật tư không được để trống',
        },
        len: {
          args: [2, 50],
          msg: 'Mã vật tư phải có độ dài từ 2 đến 50 ký tự',
        },
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        name: 'items_name_unique',
        msg: 'Tên vật tư đã tồn tại trong hệ thống',
      }, 
      validate: {
        notEmpty: {
          msg: 'Tên vật tư không được để trống',
        },
        len: {
          args: [2, 255],
          msg: 'Tên vật tư phải có độ dài từ 2 đến 255 ký tự',
        },
      },
    },
    specifications: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    unit_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Đơn vị tính không được để trống',
        },
      },
    },
  },
  {
    sequelize,
    tableName: 'items',
    timestamps: false,
  }
);

Item.belongsTo(Unit, { foreignKey: 'unit_id', as: 'unit' });
