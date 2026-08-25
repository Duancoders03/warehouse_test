export interface SupplierDto {
  id: string;
  code: string;
  name: string;
  address?: string;
  tax_code?: string;
}

export type CreateSupplierDto = Omit<SupplierDto, 'id'>;

export type UpdateSupplierDto = Partial<CreateSupplierDto>;
