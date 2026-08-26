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
  status?: 'DRAFT' | 'PUBLIC' | 'CANCEL';
  created_by_id: string;
  keeper_id?: string;
  accountant_id?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
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
    | 'status'
    | 'keeper_id'
    | 'accountant_id'
    | 'created_at'
    | 'updated_at'
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
  declare status: 'DRAFT' | 'PUBLIC' | 'CANCEL';
  declare created_by_id: string;
  declare keeper_id: string;
  declare accountant_id: string;
  declare created_at: Date | string;
  declare updated_at: Date | string;
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
      unique: {
        name: 'unique_receipt_no',
        msg: 'Số phiếu nhập đã tồn tại trong hệ thống.',
      },
      validate: {
        notNull: {
          msg: 'Số phiếu nhập không được để trống.',
        },
        notEmpty: {
          msg: 'Số phiếu nhập không được để trống.',
        },
        len: {
          args: [1, 50],
          msg: 'Số phiếu nhập phải có từ 1 đến 50 ký tự.',
        },
      },
    },
    receipt_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        notNull: {
          msg: 'Ngày lập phiếu không được để trống.',
        },
        notEmpty: {
          msg: 'Ngày lập phiếu không được để trống.',
        },
        isDate: {
          args: true,
          msg: 'Ngày lập phiếu không hợp lệ.',
        },
      },
    },
    original_document_no: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: 'Số chứng từ gốc không được vượt quá 100 ký tự.',
        },
      },
    },
    original_document_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: {
          args: true,
          msg: 'Ngày chứng từ gốc không hợp lệ.',
        },
      },
    },
    deliverer_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: 'Tên người giao hàng không được vượt quá 100 ký tự.',
        },
      },
    },
    supplier_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Vui lòng chọn Nhà Cung Cấp / Đơn Vị Giao.',
        },
        notEmpty: {
          msg: 'Vui lòng chọn Nhà Cung Cấp / Đơn Vị Giao.',
        },
      },
    },
    warehouse_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Vui lòng chọn Kho Nhận Mặc Định.',
        },
        notEmpty: {
          msg: 'Vui lòng chọn Kho Nhận Mặc Định.',
        },
      },
    },
    debit_account: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: {
          args: [0, 20],
          msg: 'Tài khoản nợ không được vượt quá 20 ký tự.',
        },
      },
    },
    credit_account: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: {
          args: [0, 20],
          msg: 'Tài khoản có không được vượt quá 20 ký tự.',
        },
      },
    },
    total_amount: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
      validate: {
        isDecimal: {
          msg: 'Tổng tiền không hợp lệ.',
        },
        min: {
          args: [0],
          msg: 'Tổng tiền không được âm.',
        },
      },
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'PUBLIC', 'CANCEL'),
      allowNull: false,
      defaultValue: 'DRAFT',
      validate: {
        isIn: {
          args: [['DRAFT', 'PUBLIC', 'CANCEL']],
          msg: 'Trạng thái phiếu nhập kho không hợp lệ.',
        },
      },
    },
    created_by_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Người lập phiếu không được để trống.',
        },
      },
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
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'inventory_receipts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
