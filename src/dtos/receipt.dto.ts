export interface UnitDto {
  id: string;
  code: string;
  name: string;
}

export interface WarehouseDto {
  id: string;
  code: string;
  name: string;
  address?: string;
}

export interface SupplierDto {
  id: string;
  code: string;
  name: string;
  address?: string;
  tax_code?: string;
}

export interface EmployeeDto {
  id: string;
  code: string;
  full_name: string;
  department?: string;
  role: 'CREATOR' | 'KEEPER' | 'ACCOUNTANT';
  warehouse_id?: string;
}

export interface ItemDto {
  id: string;
  code: string;
  name: string;
  specifications?: string;
  unit_id: string;
  unit?: UnitDto;
}

export interface InventoryReceiptDetailDto {
  id?: string;
  receipt_id?: string;
  line_number: number;
  item_id: string;
  item_code?: string;
  item_name?: string;
  specifications?: string;
  unit_id: string;
  unit_name?: string;
  warehouse_id?: string;
  warehouse_name?: string;
  document_quantity: number;
  actual_quantity: number;
  unit_price: number;
  amount: number;
}

export interface InventoryReceiptDto {
  id: string;
  receipt_no: string;
  receipt_date: string;
  original_document_no?: string;
  original_document_date?: string;
  deliverer_name?: string;
  supplier_id?: string;
  supplier?: SupplierDto;
  warehouse_id?: string;
  warehouse?: WarehouseDto;
  debit_account?: string;
  credit_account?: string;
  total_amount: number;
  created_by_id: string;
  created_by?: EmployeeDto;
  keeper_id?: string;
  keeper?: EmployeeDto;
  accountant_id?: string;
  accountant?: EmployeeDto;
  details: InventoryReceiptDetailDto[];
  created_at?: string;
}

export interface CreateReceiptDto {
  receipt_no: string;
  receipt_date: string;
  original_document_no?: string;
  original_document_date?: string;
  deliverer_name?: string;
  supplier_id?: string;
  warehouse_id?: string;
  debit_account?: string;
  credit_account?: string;
  created_by_id: string;
  keeper_id?: string;
  accountant_id?: string;
  details: {
    item_id: string;
    unit_id: string;
    warehouse_id?: string;
    document_quantity: number;
    actual_quantity: number;
    unit_price: number;
  }[];
}
