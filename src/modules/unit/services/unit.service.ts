import { Op } from 'sequelize';
import { Unit } from '../models/unit.model';
import { UnitDto, CreateUnitDto, UpdateUnitDto } from '../dtos/unit.dto';
import { handleSequelizeValidationError } from '../../../utils/error-handler';

export class UnitService {
  async getUnits(keyword?: string): Promise<UnitDto[]> {
    const whereClause: any = {};
    if (keyword && keyword.trim()) {
      const q = `%${keyword.trim().toLowerCase()}%`;
      whereClause[Op.or] = [
        { code: { [Op.iLike]: q } },
        { name: { [Op.iLike]: q } },
      ];
    }

    const units = await Unit.findAll({
      where: whereClause,
      order: [['code', 'ASC']],
    });
    return units.map(u => u.toJSON() as UnitDto);
  }

  async getUnitById(id: string): Promise<UnitDto | null> {
    const unit = await Unit.findByPk(id);
    return unit ? (unit.toJSON() as UnitDto) : null;
  }

  async createUnit(dto: CreateUnitDto): Promise<UnitDto> {
    try {
      const unit = await Unit.create({
        code: dto.code.toUpperCase().trim(),
        name: dto.name.trim(),
      });
      return unit.toJSON() as UnitDto;
    } catch (error: any) {
      handleSequelizeValidationError(error);
      throw error;
    }
  }

  async updateUnit(id: string, dto: UpdateUnitDto): Promise<UnitDto> {
    const unit = await Unit.findByPk(id);
    if (!unit) {
      throw new Error('Không tìm thấy đơn vị tính cần cập nhật.');
    }

    try {
      if (dto.code) unit.code = dto.code.toUpperCase().trim();
      if (dto.name) unit.name = dto.name.trim();

      await unit.save();
      return unit.toJSON() as UnitDto;
    } catch (error: any) {
      handleSequelizeValidationError(error);
      throw error;
    }
  }

  async deleteUnit(id: string): Promise<boolean> {
    const unit = await Unit.findByPk(id);
    if (!unit) {
      throw new Error('Không tìm thấy đơn vị tính cần xóa.');
    }

    await unit.destroy();
    return true;
  }
}

export const unitService = new UnitService();
