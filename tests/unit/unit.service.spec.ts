import { unitService } from '../../src/modules/unit/services/unit.service';
import { Unit } from '../../src/models';

describe('UnitService (Module Đơn vị tính - Full Coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUnits & getUnitById', () => {
    it('TC_UNT_001: Hiển thị danh sách & Tìm kiếm đơn vị tính theo từ khóa', async () => {
      const mockUnits = [
        { id: '1', code: 'CAI', name: 'Cái', toJSON: () => ({ id: '1', code: 'CAI', name: 'Cái' }) },
      ];
      jest.spyOn(Unit, 'findAll').mockResolvedValue(mockUnits as any);

      const result = await unitService.getUnits('Cái');
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe('CAI');
    });

    it('TC_UNT_002: Lấy chi tiết đơn vị tính theo ID hợp lệ', async () => {
      const mockUnit = { id: 'unit-1', code: 'CAI', name: 'Cái', toJSON: () => ({ id: 'unit-1', code: 'CAI', name: 'Cái' }) };
      jest.spyOn(Unit, 'findByPk').mockResolvedValue(mockUnit as any);

      const result = await unitService.getUnitById('unit-1');
      expect(result?.id).toBe('unit-1');
    });

    it('TC_UNT_003: Trả về null khi tìm đơn vị tính với ID không tồn tại', async () => {
      jest.spyOn(Unit, 'findByPk').mockResolvedValue(null);

      const result = await unitService.getUnitById('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('createUnit', () => {
    it('TC_UNT_004: Tạo mới đơn vị tính hợp lệ (Tự động in hoa mã code)', async () => {
      const dto = { code: 'cai', name: 'Cái' };
      const createdUnit = {
        id: '1',
        code: 'CAI',
        name: 'Cái',
        toJSON: () => ({ id: '1', code: 'CAI', name: 'Cái' }),
      };
      jest.spyOn(Unit, 'create').mockResolvedValue(createdUnit as any);

      const result = await unitService.createUnit(dto);
      expect(result.code).toBe('CAI');
      expect(Unit.create).toHaveBeenCalledWith({ code: 'CAI', name: 'Cái' });
    });

    it('TC_UNT_005: Lỗi khi để trống tên đơn vị tính', async () => {
      jest.spyOn(Unit, 'create').mockRejectedValue(new Error('Tên đơn vị tính không được để trống'));

      await expect(unitService.createUnit({ code: 'CAI', name: '' })).rejects.toThrow(
        'Tên đơn vị tính không được để trống'
      );
    });

    it('TC_UNT_006: Lỗi tạo trùng tên / mã đơn vị tính', async () => {
      jest.spyOn(Unit, 'create').mockRejectedValue(new Error('Tên đơn vị tính đã tồn tại'));

      await expect(unitService.createUnit({ code: 'CAI', name: 'Cái' })).rejects.toThrow(
        'Tên đơn vị tính đã tồn tại'
      );
    });
  });

  describe('updateUnit', () => {
    it('TC_UNT_007: Cập nhật thông tin đơn vị tính thành công', async () => {
      const existingUnit = {
        id: '1',
        code: 'HOP',
        name: 'Hộp',
        save: jest.fn().mockResolvedValue(true),
        toJSON: () => ({ id: '1', code: 'HOP', name: 'Hộp (đã sửa)' }),
      };
      jest.spyOn(Unit, 'findByPk').mockResolvedValue(existingUnit as any);

      const result = await unitService.updateUnit('1', { name: 'Hộp (đã sửa)' });
      expect(existingUnit.save).toHaveBeenCalled();
      expect(result.name).toBe('Hộp (đã sửa)');
    });

    it('TC_UNT_008: Lỗi cập nhật đơn vị tính với ID không tồn tại', async () => {
      jest.spyOn(Unit, 'findByPk').mockResolvedValue(null);

      await expect(unitService.updateUnit('invalid-id', { name: 'Test' })).rejects.toThrow(
        'Không tìm thấy đơn vị tính cần cập nhật.'
      );
    });
  });

  describe('deleteUnit', () => {
    it('TC_UNT_009: Xóa đơn vị tính chưa được sử dụng thành công', async () => {
      const existingUnit = {
        id: '1',
        destroy: jest.fn().mockResolvedValue(true),
      };
      jest.spyOn(Unit, 'findByPk').mockResolvedValue(existingUnit as any);

      const result = await unitService.deleteUnit('1');
      expect(result).toBe(true);
      expect(existingUnit.destroy).toHaveBeenCalled();
    });

    it('TC_UNT_010: Lỗi xóa đơn vị tính đang được sử dụng ở bảng Vật tư / Phiếu', async () => {
      const existingUnit = {
        id: '1',
        destroy: jest.fn().mockRejectedValue(new Error('Khóa ngoại không cho phép xóa')),
      };
      jest.spyOn(Unit, 'findByPk').mockResolvedValue(existingUnit as any);

      await expect(unitService.deleteUnit('1')).rejects.toThrow('Khóa ngoại không cho phép xóa');
    });
  });
});
