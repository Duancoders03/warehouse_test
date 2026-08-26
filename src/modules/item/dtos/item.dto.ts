import { UnitDto } from '../../unit/dtos/unit.dto';

export interface ItemDto {
  id: string;
  code: string;
  name: string;
  specifications?: string;
  unit_id: string;
  unit?: UnitDto;
}

export type CreateItemDto = Omit<ItemDto, 'id' | 'unit'>;

export type UpdateItemDto = Partial<CreateItemDto>;
