export interface UnitDto {
  id: string;
  code: string;
  name: string;
}

export type CreateUnitDto = Omit<UnitDto, 'id'>;

export type UpdateUnitDto = Partial<CreateUnitDto>;
