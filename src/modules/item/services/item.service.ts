import { Item } from '../models/item.model';
import { ItemDto, CreateItemDto } from '../dtos/item.dto';

export const MOCK_ITEMS: ItemDto[] = [
  { id: 'i-1', code: 'VT-THEP-01', name: 'Thép phi 12 Hòa Phát', specifications: 'Thép cuộn CB300-V, Ø12mm, chuẩn ISO 9001', unit_id: '11111111-1111-1111-1111-111111111101' },
  { id: 'i-2', code: 'VT-CAP-02', name: 'Cáp điện Cadivi 2x2.5mm', specifications: 'Cáp đồng bọc nhựa PVC 450/750V', unit_id: '11111111-1111-1111-1111-111111111103' },
  { id: 'i-3', code: 'VT-APT-03', name: 'Aptomat 3 Pha 63A Schneider', specifications: 'MCCB EasyPact EZC100N3063, 3P 63A 18kA', unit_id: '11111111-1111-1111-1111-111111111102' },
  { id: 'i-4', code: 'VT-DEN-04', name: 'Đèn LED Panel Rạng Đông 60x60', specifications: 'Công suất 40W, ánh sáng trắng 6500K', unit_id: '11111111-1111-1111-1111-111111111102' },
  { id: 'i-5', code: 'VT-BANG-05', name: 'Băng keo cách điện 3M', specifications: 'Cuộn 18mm x 10m chịu nhiệt 80°C', unit_id: '11111111-1111-1111-1111-111111111106' },
];

export class ItemService {
  async getItems(): Promise<ItemDto[]> {
    try {
      const list = await Item.findAll({ order: [['code', 'ASC']] });
      if (list && list.length > 0) {
        return list.map(item => item.toJSON() as ItemDto);
      }
    } catch {
      // Fallback
    }
    return MOCK_ITEMS;
  }

  async getItemById(id: string): Promise<ItemDto | null> {
    try {
      const item = await Item.findByPk(id);
      if (item) return item.toJSON() as ItemDto;
    } catch {
      // Fallback
    }
    return MOCK_ITEMS.find(i => i.id === id) || null;
  }

  async createItem(dto: CreateItemDto): Promise<ItemDto> {
    const item = await Item.create({
      code: dto.code.toUpperCase().trim(),
      name: dto.name.trim(),
      specifications: dto.specifications?.trim(),
      unit_id: dto.unit_id,
    });
    return item.toJSON() as ItemDto;
  }
}

export const itemService = new ItemService();
