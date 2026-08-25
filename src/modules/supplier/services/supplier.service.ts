import { Op } from 'sequelize';
import { Supplier } from '../models/supplier.model';
import { SupplierDto, CreateSupplierDto, UpdateSupplierDto } from '../dtos/supplier.dto';
import { handleSequelizeValidationError } from '../../../utils/error-handler';
import { getPaginationParams, PaginatedResult } from '../../../utils/pagination';

export class SupplierService {
  async getSuppliers(query?: { keyword?: string; page?: number; limit?: number }): Promise<PaginatedResult<SupplierDto>> {
    const { page, limit, offset } = getPaginationParams(query?.page, query?.limit, 10);
    const keyword = query?.keyword;

    const whereClause: any = {};
    if (keyword && keyword.trim()) {
      const q = `%${keyword.trim().toLowerCase()}%`;
      whereClause[Op.or] = [
        { code: { [Op.iLike]: q } },
        { name: { [Op.iLike]: q } },
        { address: { [Op.iLike]: q } },
        { tax_code: { [Op.iLike]: q } },
      ];
    }

    const { count, rows } = await Supplier.findAndCountAll({
      where: whereClause,
      order: [['code', 'ASC']],
      limit,
      offset,
    });

    const items = rows.map(s => s.toJSON() as SupplierDto);
    const totalPages = Math.ceil(count / limit) || 1;

    return {
      items,
      totalItems: count,
      currentPage: page,
      totalPages,
      pageSize: limit,
    };
  }

  async getSupplierById(id: string): Promise<SupplierDto | null> {
    const supplier = await Supplier.findByPk(id);
    return supplier ? (supplier.toJSON() as SupplierDto) : null;
  }

  async createSupplier(dto: CreateSupplierDto): Promise<SupplierDto> {
    try {
      const supplier = await Supplier.create({
        code: dto.code.toUpperCase().trim(),
        name: dto.name.trim(),
        address: dto.address?.trim(),
        tax_code: dto.tax_code?.trim(),
      });
      return supplier.toJSON() as SupplierDto;
    } catch (error: any) {
      handleSequelizeValidationError(error);
      throw error;
    }
  }

  async updateSupplier(id: string, dto: UpdateSupplierDto): Promise<SupplierDto> {
    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      throw new Error('Không tìm thấy nhà cung cấp cần cập nhật.');
    }

    try {
      if (dto.code) supplier.code = dto.code.toUpperCase().trim();
      if (dto.name) supplier.name = dto.name.trim();
      if (dto.address !== undefined) supplier.address = dto.address.trim();
      if (dto.tax_code !== undefined) supplier.tax_code = dto.tax_code.trim();

      await supplier.save();
      return supplier.toJSON() as SupplierDto;
    } catch (error: any) {
      handleSequelizeValidationError(error);
      throw error;
    }
  }

  async deleteSupplier(id: string): Promise<boolean> {
    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      throw new Error('Không tìm thấy nhà cung cấp cần xóa.');
    }

    await supplier.destroy();
    return true;
  }
}

export const supplierService = new SupplierService();
