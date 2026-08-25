import { User } from '../models/user.model';
import { UserDto, CreateUserDto } from '../dtos/user.dto';

export const MOCK_USERS: UserDto[] = [
  { id: '33333333-3333-3333-3333-333333333301', code: 'NV-001', full_name: 'Nguyễn Văn Lập (Kế Toán Kho)', department: 'Phòng Kế Toán', role: 'CREATOR' },
  { id: '33333333-3333-3333-3333-333333333302', code: 'NV-002', full_name: 'Trần Thị Thu (Kế Toán Trưởng)', department: 'Phòng Kế Toán', role: 'ACCOUNTANT' },
  { id: '33333333-3333-3333-3333-333333333303', code: 'NV-003', full_name: 'Lê Văn Khoa (Thủ Kho)', department: 'Ban Quản Lý Kho', role: 'KEEPER' },
  { id: '33333333-3333-3333-3333-333333333304', code: 'NV-004', full_name: 'Phạm Minh Tuấn (Thủ Kho)', department: 'Ban Quản Lý Kho', role: 'KEEPER' },
];

export class UserService {
  async getUsers(role?: string): Promise<UserDto[]> {
    try {
      const whereClause = role ? { role } : {};
      const list = await User.findAll({ where: whereClause, order: [['code', 'ASC']] });
      if (list && list.length > 0) {
        return list.map(u => u.toJSON() as UserDto);
      }
    } catch {
      // Fallback to mock
    }
    if (role) {
      return MOCK_USERS.filter(u => u.role === role);
    }
    return MOCK_USERS;
  }

  async getUserById(id: string): Promise<UserDto | null> {
    try {
      const user = await User.findByPk(id);
      if (user) return user.toJSON() as UserDto;
    } catch {
      // Fallback
    }
    return MOCK_USERS.find(u => u.id === id) || null;
  }

  async createUser(dto: CreateUserDto): Promise<UserDto> {
    const user = await User.create({
      code: dto.code.toUpperCase().trim(),
      full_name: dto.full_name.trim(),
      department: dto.department?.trim(),
      role: dto.role,
    });
    return user.toJSON() as UserDto;
  }
}

export const userService = new UserService();
