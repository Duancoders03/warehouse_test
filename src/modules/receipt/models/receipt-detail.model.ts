import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../../config/database';

export interface InventoryReceiptDetailAttributes {
  id: string;
  receipt_id: string;
  line_number: number;
  item_id: string;
  unit_id: string;
  warehouse_id?: string;
  document_quantity: number;
  actual_quantity: number;
  unit_price: number;
  amount: number;
}

export interface InventoryReceiptDetailCreationAttributes
  extends Optional<InventoryReceiptDetailAttributes, 'id' | 'warehouse_id'> {}

export class InventoryReceiptDetail
  extends Model<InventoryReceiptDetailAttributes, InventoryReceiptDetailCreationAttributes>
  implements InventoryReceiptDetailAttributes
{
  declare id: string;
  declare receipt_id: string;
  declare line_number: number;
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
    },
    line_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    item_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    unit_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    warehouse_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    document_quantity: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false,
    },
    actual_quantity: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'inventory_receipt_details',
    timestamps: false,
  }
);
