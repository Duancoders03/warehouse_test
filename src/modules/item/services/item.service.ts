import { Op } from 'sequelize';
import { Item } from '../models/item.model';
import { Unit } from '../../unit/models/unit.model';
import { ItemDto, CreateItemDto, UpdateItemDto } from '../dtos/item.dto';
import { handleSequelizeValidationError } from '../../../utils/error-handler';
import { getPaginationParams, PaginatedResult } from '../../../utils/pagination';

export class ItemService {
  async getItems(query?: { keyword?: string; page?: number; limit?: number }): Promise<PaginatedResult<ItemDto>> {
    const { page, limit, offset } = getPaginationParams(query?.page, query?.limit, 10);
    const keyword = query?.keyword;

    const whereClause: any = {};
    if (keyword && keyword.trim()) {
      const q = `%${keyword.trim().toLowerCase()}%`;
      whereClause[Op.or] = [
        { code: { [Op.iLike]: q } },
        { name: { [Op.iLike]: q } },
        { specifications: { [Op.iLike]: q } },
      ];
    }

    const { count, rows } = await Item.findAndCountAll({
      where: whereClause,
      include: [{ model: Unit, as: 'unit' }],
      order: [['code', 'ASC']],
      limit,
      offset,
    });

    const items = rows.map(item => item.toJSON() as ItemDto);
    const totalPages = Math.ceil(count / limit) || 1;

    return {
      items,
      totalItems: count,
      currentPage: page,
      totalPages,
      pageSize: limit,
    };
  }

  async getAllItemsList(): Promise<ItemDto[]> {
    const rows = await Item.findAll({
      include: [{ model: Unit, as: 'unit' }],
      order: [['code', 'ASC']],
    });
    return rows.map(item => item.toJSON() as ItemDto);
  }

  async getItemById(id: string): Promise<ItemDto | null> {
    const item = await Item.findByPk(id, {
      include: [{ model: Unit, as: 'unit' }],
    });
    return item ? (item.toJSON() as ItemDto) : null;
  }

  async createItem(dto: CreateItemDto): Promise<ItemDto> {
    try {
      const item = await Item.create({
        code: dto.code.toUpperCase().trim(),
        name: dto.name.trim(),
        specifications: dto.specifications?.trim(),
        unit_id: dto.unit_id,
      });

      const createdItem = await Item.findByPk(item.id, {
        include: [{ model: Unit, as: 'unit' }],
      });
      return createdItem!.toJSON() as ItemDto;
    } catch (error: any) {
      handleSequelizeValidationError(error);
      throw error;
    }
  }

  async updateItem(id: string, dto: UpdateItemDto): Promise<ItemDto> {
    const item = await Item.findByPk(id);
    if (!item) {
      throw new Error('Không tìm thấy vật tư/hàng hóa cần cập nhật.');
    }

    try {
      if (dto.code) item.code = dto.code.toUpperCase().trim();
      if (dto.name) item.name = dto.name.trim();
      if (dto.specifications !== undefined) item.specifications = dto.specifications.trim();
      if (dto.unit_id) item.unit_id = dto.unit_id;

      await item.save();

      const updatedItem = await Item.findByPk(id, {
        include: [{ model: Unit, as: 'unit' }],
      });
      return updatedItem!.toJSON() as ItemDto;
    } catch (error: any) {
      handleSequelizeValidationError(error);
      throw error;
    }
  }

  async deleteItem(id: string): Promise<boolean> {
    const item = await Item.findByPk(id);
    if (!item) {
      throw new Error('Không tìm thấy vật tư/hàng hóa cần xóa.');
    }

    await item.destroy();
    return true;
  }
}

export const itemService = new ItemService();
