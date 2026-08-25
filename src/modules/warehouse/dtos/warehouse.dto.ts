export interface WarehouseDto {
  id: string;
  code: string;
  name: string;
  address?: string;
}

export interface CreateWarehouseDto {
  code: string;
  name: string;
  address?: string;
}
