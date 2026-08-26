import { Op } from 'sequelize';
import { Warehouse } from '../models/warehouse.model';
import { WarehouseDto, CreateWarehouseDto, UpdateWarehouseDto } from '../dtos/warehouse.dto';
import { handleSequelizeValidationError } from '../../../utils/error-handler';

export class WarehouseService {
  async getWarehouses(keyword?: string): Promise<WarehouseDto[]> {
    const whereClause: any = {};
    if (keyword && keyword.trim()) {
      const q = `%${keyword.trim().toLowerCase()}%`;
      whereClause[Op.or] = [
        { code: { [Op.iLike]: q } },
        { name: { [Op.iLike]: q } },
        { address: { [Op.iLike]: q } },
      ];
    }

    const list = await Warehouse.findAll({
      where: whereClause,
      order: [['code', 'ASC']],
    });
    return list.map(w => w.toJSON() as WarehouseDto);
  }

  async getWarehouseById(id: string): Promise<WarehouseDto | null> {
    const warehouse = await Warehouse.findByPk(id);
    return warehouse ? (warehouse.toJSON() as WarehouseDto) : null;
  }

  async createWarehouse(dto: CreateWarehouseDto): Promise<WarehouseDto> {
    try {
      const warehouse = await Warehouse.create({
        code: dto.code.toUpperCase().trim(),
        name: dto.name.trim(),
        address: dto.address.trim(),
      });
      return warehouse.toJSON() as WarehouseDto;
    } catch (error: any) {
      handleSequelizeValidationError(error);
      throw error;
    }
  }

  async updateWarehouse(id: string, dto: UpdateWarehouseDto): Promise<WarehouseDto> {
    const warehouse = await Warehouse.findByPk(id);
    if (!warehouse) {
      throw new Error('Không tìm thấy kho hàng cần cập nhật.');
    }

    try {
      if (dto.code) warehouse.code = dto.code.toUpperCase().trim();
      if (dto.name) warehouse.name = dto.name.trim();
      if (dto.address) warehouse.address = dto.address.trim();

      await warehouse.save();
      return warehouse.toJSON() as WarehouseDto;
    } catch (error: any) {
      handleSequelizeValidationError(error);
      throw error;
    }
  }

  async deleteWarehouse(id: string): Promise<boolean> {
    const warehouse = await Warehouse.findByPk(id);
    if (!warehouse) {
      throw new Error('Không tìm thấy kho hàng cần xóa.');
    }

    await warehouse.destroy();
    return true;
  }
}

export const warehouseService = new WarehouseService();
