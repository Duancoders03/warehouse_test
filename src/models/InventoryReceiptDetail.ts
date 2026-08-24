import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class InventoryReceiptDetail extends Model {
  public id!: string;
  public receipt_id!: string;
  public line_number!: number;
  public item_id!: string;
  public unit_id!: string;
  public warehouse_id!: string;
  public document_quantity!: number;
  public actual_quantity!: number;
  public unit_price!: number;
  public amount!: number;
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
      type: DataTypes.NUMERIC(12, 3),
      allowNull: false,
    },
    actual_quantity: {
      type: DataTypes.NUMERIC(12, 3),
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.NUMERIC(18, 2),
      allowNull: false,
    },
    amount: {
      type: DataTypes.NUMERIC(18, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'inventory_receipt_details',
    timestamps: false,
  }
);
