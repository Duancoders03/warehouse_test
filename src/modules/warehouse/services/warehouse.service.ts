import { Warehouse } from '../models/warehouse.model';
import { WarehouseDto, CreateWarehouseDto } from '../dtos/warehouse.dto';

export const MOCK_WAREHOUSES: WarehouseDto[] = [
  { id: 'w-1', code: 'KHO-TONG', name: 'Kho Tổng Trung Tâm VIMES', address: 'Khu công nghiệp Tân Bình, TP.HCM' },
  { id: 'w-2', code: 'KHO-VT1', name: 'Kho Vật Tư 01 - Cầu Giấy', address: 'Quận Cầu Giấy, Hà Nội' },
  { id: 'w-3', code: 'KHO-TP', name: 'Kho Thành Phẩm Dĩ An', address: 'TX Dĩ An, Bình Dương' },
];

export class WarehouseService {
  async getWarehouses(): Promise<WarehouseDto[]> {
    try {
      const list = await Warehouse.findAll({ order: [['code', 'ASC']] });
      if (list && list.length > 0) {
        return list.map(w => w.toJSON() as WarehouseDto);
      }
    } catch {
      // Fallback to mock data
    }
    return MOCK_WAREHOUSES;
  }

  async getWarehouseById(id: string): Promise<WarehouseDto | null> {
    try {
      const warehouse = await Warehouse.findByPk(id);
      if (warehouse) return warehouse.toJSON() as WarehouseDto;
    } catch {
      // Fallback
    }
    return MOCK_WAREHOUSES.find(w => w.id === id) || null;
  }

  async createWarehouse(dto: CreateWarehouseDto): Promise<WarehouseDto> {
    const warehouse = await Warehouse.create({
      code: dto.code.toUpperCase().trim(),
      name: dto.name.trim(),
      address: dto.address?.trim(),
    });
    return warehouse.toJSON() as WarehouseDto;
  }
}

export const warehouseService = new WarehouseService();
