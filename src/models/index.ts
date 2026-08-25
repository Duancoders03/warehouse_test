import { Unit } from '../modules/unit/models/unit.model';
import { Warehouse } from '../modules/warehouse/models/warehouse.model';
import { Supplier } from '../modules/supplier/models/supplier.model';
import { Employee } from '../modules/employee/models/employee.model';
import { Item } from '../modules/item/models/item.model';
import { InventoryReceipt } from '../modules/receipt/models/receipt.model';
import { InventoryReceiptDetail } from '../modules/receipt/models/receipt-detail.model';

// Relationships
Unit.hasMany(Item, { foreignKey: 'unit_id', as: 'items' });
Item.belongsTo(Unit, { foreignKey: 'unit_id', as: 'unit' });

Warehouse.hasMany(Employee, { foreignKey: 'warehouse_id', as: 'employees' });
Employee.belongsTo(Warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' });

Supplier.hasMany(InventoryReceipt, { foreignKey: 'supplier_id', as: 'receipts' });
InventoryReceipt.belongsTo(Supplier, { foreignKey: 'supplier_id', as: 'supplier' });

Warehouse.hasMany(InventoryReceipt, { foreignKey: 'warehouse_id', as: 'receipts' });
InventoryReceipt.belongsTo(Warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' });

Employee.hasMany(InventoryReceipt, { foreignKey: 'created_by_id', as: 'created_receipts' });
InventoryReceipt.belongsTo(Employee, { foreignKey: 'created_by_id', as: 'created_by' });

Employee.hasMany(InventoryReceipt, { foreignKey: 'keeper_id', as: 'keeper_receipts' });
InventoryReceipt.belongsTo(Employee, { foreignKey: 'keeper_id', as: 'keeper' });

Employee.hasMany(InventoryReceipt, { foreignKey: 'accountant_id', as: 'accountant_receipts' });
InventoryReceipt.belongsTo(Employee, { foreignKey: 'accountant_id', as: 'accountant' });

InventoryReceipt.hasMany(InventoryReceiptDetail, { foreignKey: 'receipt_id', as: 'details', onDelete: 'CASCADE' });
InventoryReceiptDetail.belongsTo(InventoryReceipt, { foreignKey: 'receipt_id', as: 'receipt' });

Item.hasMany(InventoryReceiptDetail, { foreignKey: 'item_id', as: 'receipt_details' });
InventoryReceiptDetail.belongsTo(Item, { foreignKey: 'item_id', as: 'item' });

Unit.hasMany(InventoryReceiptDetail, { foreignKey: 'unit_id', as: 'receipt_details' });
InventoryReceiptDetail.belongsTo(Unit, { foreignKey: 'unit_id', as: 'unit' });

Warehouse.hasMany(InventoryReceiptDetail, { foreignKey: 'warehouse_id', as: 'receipt_details' });
InventoryReceiptDetail.belongsTo(Warehouse, { foreignKey: 'warehouse_id', as: 'actual_warehouse' });

export {
  Unit,
  Warehouse,
  Supplier,
  Employee,
  Item,
  InventoryReceipt,
  InventoryReceiptDetail,
};
