import { Op } from 'sequelize';
import { User } from '../models/user.model';
import { UserDto, CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { handleSequelizeValidationError } from '../../../utils/error-handler';
import { getPaginationParams, PaginatedResult } from '../../../utils/pagination';

export class UserService {
  async getUsers(query?: { keyword?: string; role?: string; page?: number; limit?: number }): Promise<PaginatedResult<UserDto>> {
    const { page, limit, offset } = getPaginationParams(query?.page, query?.limit, 10);
    const keyword = query?.keyword;
    const role = query?.role;

    const whereClause: any = {};

    if (role && role.trim()) {
      whereClause.role = role.trim().toLowerCase();
    }

    if (keyword && keyword.trim()) {
      const q = `%${keyword.trim().toLowerCase()}%`;
      whereClause[Op.or] = [
        { code: { [Op.iLike]: q } },
        { full_name: { [Op.iLike]: q } },
        { department: { [Op.iLike]: q } },
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      order: [['code', 'ASC']],
      limit,
      offset,
    });

    const items = rows.map(u => u.toJSON() as UserDto);
    const totalPages = Math.ceil(count / limit) || 1;

    return {
      items,
      totalItems: count,
      currentPage: page,
      totalPages,
      pageSize: limit,
    };
  }

  async getAllUsersList(role?: string): Promise<UserDto[]> {
    const whereClause: any = {};
    if (role && role.trim()) {
      whereClause.role = role.trim().toLowerCase();
    }
    const rows = await User.findAll({
      where: whereClause,
      order: [['code', 'ASC']],
    });
    return rows.map(u => u.toJSON() as UserDto);
  }

  async getUserById(id: string): Promise<UserDto | null> {
    const user = await User.findByPk(id);
    return user ? (user.toJSON() as UserDto) : null;
  }

  async createUser(dto: CreateUserDto): Promise<UserDto> {
    try {
      const user = await User.create({
        code: dto.code.toUpperCase().trim(),
        full_name: dto.full_name.trim(),
        department: dto.department?.trim(),
        role: dto.role.toLowerCase() as any,
      });
      return user.toJSON() as UserDto;
    } catch (error: any) {
      handleSequelizeValidationError(error);
      throw error;
    }
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserDto> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('Không tìm thấy người dùng cần cập nhật.');
    }

    try {
      if (dto.code) user.code = dto.code.toUpperCase().trim();
      if (dto.full_name) user.full_name = dto.full_name.trim();
      if (dto.department !== undefined) user.department = dto.department.trim();
      if (dto.role) user.role = dto.role.toLowerCase() as any;

      await user.save();
      return user.toJSON() as UserDto;
    } catch (error: any) {
      handleSequelizeValidationError(error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('Không tìm thấy người dùng cần xóa.');
    }

    await user.destroy();
    return true;
  }
}

export const userService = new UserService();
