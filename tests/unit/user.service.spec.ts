import { userService } from '../../src/modules/user/services/user.service';
import { User } from '../../src/models';

describe('UserService (Module Người dùng / Nhân viên - Full Coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('TC_USR_001: Tạo nhân viên phân vai trò chuẩn (KEEPER, ACCOUNTANT, CREATOR)', async () => {
      const dto = { code: 'nv001', full_name: 'Nguyễn Văn A', department: 'Kho', role: 'KEEPER' as any };
      const created = {
        id: '1',
        code: 'NV001',
        full_name: 'Nguyễn Văn A',
        department: 'Kho',
        role: 'keeper',
        toJSON: () => ({ id: '1', code: 'NV001', full_name: 'Nguyễn Văn A', department: 'Kho', role: 'keeper' }),
      };
      jest.spyOn(User, 'create').mockResolvedValue(created as any);

      const result = await userService.createUser(dto);
      expect(result.code).toBe('NV001');
      expect(result.role).toBe('keeper');
    });
  });

  describe('getUsers & getAllUsersList', () => {
    it('TC_USR_002: Lọc danh sách người dùng theo Vai trò (Role Filter) & Phân trang', async () => {
      const mockRows = [
        { id: '1', code: 'NV001', full_name: 'Thủ kho 1', role: 'keeper', toJSON: () => ({ id: '1', code: 'NV001', role: 'keeper' }) }
      ];
      jest.spyOn(User, 'findAndCountAll').mockResolvedValue({ count: 1, rows: mockRows } as any);

      const result = await userService.getUsers({ role: 'keeper', page: 1 });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].role).toBe('keeper');

      jest.spyOn(User, 'findAll').mockResolvedValue(mockRows as any);
      const list = await userService.getAllUsersList('keeper');
      expect(list).toHaveLength(1);
    });
  });

  describe('updateUser & deleteUser', () => {
    it('TC_USR_003: Cập nhật thông tin & Xóa người dùng hệ thống', async () => {
      const existing = {
        id: '1',
        code: 'NV001',
        full_name: 'Nguyễn Văn A',
        save: jest.fn().mockResolvedValue(true),
        destroy: jest.fn().mockResolvedValue(true),
        toJSON: () => ({ id: '1', code: 'NV001', full_name: 'Nguyễn Văn A Sửa' }),
      };
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce(existing as any).mockResolvedValueOnce(null);

      const updated = await userService.updateUser('1', { full_name: 'Nguyễn Văn A Sửa' });
      expect(updated.full_name).toBe('Nguyễn Văn A Sửa');

      await expect(userService.updateUser('invalid-id', { full_name: 'Test' })).rejects.toThrow(
        'Không tìm thấy người dùng cần cập nhật.'
      );

      jest.spyOn(User, 'findByPk').mockResolvedValueOnce(existing as any).mockResolvedValueOnce(null);
      const deleted = await userService.deleteUser('1');
      expect(deleted).toBe(true);

      await expect(userService.deleteUser('invalid-id')).rejects.toThrow(
        'Không tìm thấy người dùng cần xóa.'
      );
    });
  });
});
