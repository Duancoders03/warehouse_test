export interface SupplierDto {
  id: string;
  code: string;
  name: string;
  address?: string;
  tax_code?: string;
}

export interface CreateSupplierDto {
  code: string;
  name: string;
  address?: string;
  tax_code?: string;
}
