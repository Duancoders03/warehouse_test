import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../../config/database';

export interface InventoryReceiptAttributes {
  id: string;
  receipt_no: string;
  receipt_date: Date | string;
  original_document_no?: string;
  original_document_date?: Date | string;
  deliverer_name?: string;
  supplier_id?: string;
  warehouse_id?: string;
  debit_account?: string;
  credit_account?: string;
  total_amount?: number;
  created_by_id: string;
  keeper_id?: string;
  accountant_id?: string;
  created_at?: Date;
}

export interface InventoryReceiptCreationAttributes
  extends Optional<
    InventoryReceiptAttributes,
    | 'id'
    | 'receipt_date'
    | 'original_document_no'
    | 'original_document_date'
    | 'deliverer_name'
    | 'supplier_id'
    | 'warehouse_id'
    | 'debit_account'
    | 'credit_account'
    | 'total_amount'
    | 'keeper_id'
    | 'accountant_id'
    | 'created_at'
  > {}

export class InventoryReceipt
  extends Model<InventoryReceiptAttributes, InventoryReceiptCreationAttributes>
  implements InventoryReceiptAttributes
{
  declare id: string;
  declare receipt_no: string;
  declare receipt_date: Date | string;
  declare original_document_no: string;
  declare original_document_date: Date | string;
  declare deliverer_name: string;
  declare supplier_id: string;
  declare warehouse_id: string;
  declare debit_account: string;
  declare credit_account: string;
  declare total_amount: number;
  declare created_by_id: string;
  declare keeper_id: string;
  declare accountant_id: string;
  declare created_at: Date;
}

InventoryReceipt.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    receipt_no: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    receipt_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    original_document_no: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    original_document_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    deliverer_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    supplier_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    warehouse_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    debit_account: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    credit_account: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    total_amount: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
    },
    created_by_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    keeper_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    accountant_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'inventory_receipts',
    timestamps: false,
  }
);
