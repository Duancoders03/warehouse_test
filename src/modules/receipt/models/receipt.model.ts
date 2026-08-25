import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database';

export class InventoryReceipt extends Model {
  public id!: string;
  public receipt_no!: string;
  public receipt_date!: Date;
  public original_document_no!: string;
  public original_document_date!: Date;
  public deliverer_name!: string;
  public supplier_id!: string;
  public warehouse_id!: string;
  public debit_account!: string;
  public credit_account!: string;
  public total_amount!: number;
  public created_by_id!: string;
  public keeper_id!: string;
  public accountant_id!: string;
  public created_at!: Date;
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
