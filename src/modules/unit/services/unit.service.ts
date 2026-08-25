import { Unit } from '../models/unit.model';
import { UnitDto, CreateUnitDto } from '../dtos/unit.dto';

export const MOCK_UNITS: UnitDto[] = [
  { id: 'u-1', code: 'KG', name: 'Kilôgam' },
  { id: 'u-2', code: 'CAI', name: 'Cái' },
  { id: 'u-3', code: 'MET', name: 'Mét' },
  { id: 'u-4', code: 'THUNG', name: 'Thùng' },
  { id: 'u-5', code: 'BO', name: 'Bộ' },
  { id: 'u-6', code: 'CUON', name: 'Cuộn' },
  { id: 'u-7', code: 'TAN', name: 'Tấn' },
  { id: 'u-8', code: 'HOP', name: 'Hộp' },
];

export class UnitService {
  async getUnits(): Promise<UnitDto[]> {
    try {
      const units = await Unit.findAll({ order: [['code', 'ASC']] });
      if (units && units.length > 0) {
        return units.map(u => u.toJSON() as UnitDto);
      }
    } catch {
      // Fallback to mock data if DB table is not seeded yet
    }
    return MOCK_UNITS;
  }

  async getUnitById(id: string): Promise<UnitDto | null> {
    try {
      const unit = await Unit.findByPk(id);
      if (unit) return unit.toJSON() as UnitDto;
    } catch {
      // Fallback
    }
    return MOCK_UNITS.find(u => u.id === id) || null;
  }

  async createUnit(dto: CreateUnitDto): Promise<UnitDto> {
    const unit = await Unit.create({
      code: dto.code.toUpperCase().trim(),
      name: dto.name.trim(),
    });
    return unit.toJSON() as UnitDto;
  }
}

export const unitService = new UnitService();
