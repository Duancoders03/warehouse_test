import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../../config/database';

export interface InventoryReceiptDetailAttributes {
  id: string;
  receipt_id: string;
  item_id: string;
  unit_id: string;
  warehouse_id?: string;
  document_quantity: number;
  actual_quantity: number;
  unit_price: number;
  amount: number;
}

export interface InventoryReceiptDetailCreationAttributes
  extends Optional<InventoryReceiptDetailAttributes, 'id' | 'warehouse_id' | 'amount'> {}

export class InventoryReceiptDetail
  extends Model<InventoryReceiptDetailAttributes, InventoryReceiptDetailCreationAttributes>
  implements InventoryReceiptDetailAttributes
{
  declare id: string;
  declare receipt_id: string;
  declare item_id: string;
  declare unit_id: string;
  declare warehouse_id: string;
  declare document_quantity: number;
  declare actual_quantity: number;
  declare unit_price: number;
  declare amount: number;
}

InventoryReceiptDetail.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    receipt_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Phiếu nhập không được để trống.',
        },
      },
    },
    item_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Vật tư không được để trống.',
        },
      },
    },
    unit_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Đơn vị tính không được để trống.',
        },
      },
    },
    warehouse_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Kho không được để trống.',
        },
      } ,
    },
    document_quantity: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Số lượng chứng từ không được để trống.',
        },
        isDecimal: {
          msg: 'Số lượng chứng từ phải là số hợp lệ.',
        },
        min: {
          args: [0],
          msg: 'Số lượng theo chứng từ không được là số âm.',
        },
      },
    },
    actual_quantity: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Số lượng thực nhập không được để trống.',
        },
        isDecimal: {
          msg: 'Số lượng thực nhập phải là số hợp lệ.',
        },
        min: {
          args: [0.001],
          msg: 'Số lượng thực nhập phải lớn hơn 0.',
        },
      },
    },
    unit_price: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Đơn giá không được để trống.',
        },
        isDecimal: {
          msg: 'Đơn giá phải là số hợp lệ.',
        },
        min: {
          args: [0],
          msg: 'Đơn giá không được là số âm.',
        },
      },
    },
    amount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Thành tiền không được để trống.',
        },
        isDecimal: {
          msg: 'Thành tiền phải là số hợp lệ.',
        },
        min: {
          args: [0],
          msg: 'Thành tiền không được là số âm.',
        },
      },
    },
  },
  {
    sequelize,
    tableName: 'inventory_receipt_details',
    timestamps: false,
  }
);
