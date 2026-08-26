export interface WarehouseDto {
  id: string;
  code: string;
  name: string;
  address: string;
}

export type CreateWarehouseDto = Omit<WarehouseDto, 'id'>;

export type UpdateWarehouseDto = Partial<CreateWarehouseDto>;
