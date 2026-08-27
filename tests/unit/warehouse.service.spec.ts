import { warehouseService } from '../../src/modules/warehouse/services/warehouse.service';
import { Warehouse } from '../../src/models';

describe('WarehouseService (Module Kho Hàng - Full Coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getWarehouses & getWarehouseById', () => {
    it('TC_WHS_001: Hiển thị trang danh sách & Tìm kiếm kho hàng', async () => {
      const mockList = [
        { id: '1', code: 'KHO_CHINH', name: 'Kho Chính', address: 'Hà Nội', toJSON: () => ({ id: '1', code: 'KHO_CHINH', name: 'Kho Chính', address: 'Hà Nội' }) }
      ];
      jest.spyOn(Warehouse, 'findAll').mockResolvedValue(mockList as any);

      const result = await warehouseService.getWarehouses('Kho Chính');
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe('KHO_CHINH');
    });

    it('TC_WHS_002: Lấy chi tiết kho hàng theo ID & Xử lý khi ID không tồn tại', async () => {
      const mockWh = { id: 'wh-1', code: 'KHO_01', name: 'Kho 1', toJSON: () => ({ id: 'wh-1', code: 'KHO_01' }) };
      jest.spyOn(Warehouse, 'findByPk').mockResolvedValueOnce(mockWh as any).mockResolvedValueOnce(null);

      const found = await warehouseService.getWarehouseById('wh-1');
      expect(found?.code).toBe('KHO_01');

      const notFound = await warehouseService.getWarehouseById('invalid-id');
      expect(notFound).toBeNull();
    });
  });

  describe('createWarehouse', () => {
    it('TC_WHS_003: Tạo kho hàng mới hợp lệ (In hoa mã kho code)', async () => {
      const dto = { code: 'kho_chinh', name: 'Kho Chính Tổng', address: 'Hà Nội' };
      const created = {
        id: '1',
        code: 'KHO_CHINH',
        name: 'Kho Chính Tổng',
        address: 'Hà Nội',
        toJSON: () => ({ id: '1', code: 'KHO_CHINH', name: 'Kho Chính Tổng', address: 'Hà Nội' }),
      };
      jest.spyOn(Warehouse, 'create').mockResolvedValue(created as any);

      const result = await warehouseService.createWarehouse(dto);
      expect(result.code).toBe('KHO_CHINH');
      expect(Warehouse.create).toHaveBeenCalledWith({
        code: 'KHO_CHINH',
        name: 'Kho Chính Tổng',
        address: 'Hà Nội',
      });
    });

    it('TC_WHS_004: Lỗi khi mã kho trùng lặp', async () => {
      jest.spyOn(Warehouse, 'create').mockRejectedValue(new Error('Mã kho đã tồn tại trong hệ thống'));

      await expect(
        warehouseService.createWarehouse({ code: 'KHO_CHINH', name: 'Kho 2', address: 'HCM' })
      ).rejects.toThrow('Mã kho đã tồn tại trong hệ thống');
    });
  });

  describe('updateWarehouse', () => {
    it('TC_WHS_005: Cập nhật kho hàng thành công & Báo lỗi khi ID không tồn tại', async () => {
      const existing = {
        id: '1',
        code: 'KHO_01',
        name: 'Kho 1',
        address: 'Hà Nội',
        save: jest.fn().mockResolvedValue(true),
        toJSON: () => ({ id: '1', code: 'KHO_01', name: 'Kho 1 Sửa', address: 'Hải Phòng' }),
      };
      jest.spyOn(Warehouse, 'findByPk').mockResolvedValueOnce(existing as any).mockResolvedValueOnce(null);

      const updated = await warehouseService.updateWarehouse('1', { address: 'Hải Phòng' });
      expect(existing.save).toHaveBeenCalled();
      expect(updated.address).toBe('Hải Phòng');

      await expect(warehouseService.updateWarehouse('invalid-id', { name: 'Test' })).rejects.toThrow(
        'Không tìm thấy kho hàng cần cập nhật.'
      );
    });
  });

  describe('deleteWarehouse', () => {
    it('TC_WHS_006: Xóa kho hàng hợp lệ & Báo lỗi khi ID rác', async () => {
      const existing = {
        id: '1',
        destroy: jest.fn().mockResolvedValue(true),
      };
      jest.spyOn(Warehouse, 'findByPk').mockResolvedValueOnce(existing as any).mockResolvedValueOnce(null);

      const result = await warehouseService.deleteWarehouse('1');
      expect(result).toBe(true);

      await expect(warehouseService.deleteWarehouse('invalid-id')).rejects.toThrow(
        'Không tìm thấy kho hàng cần xóa.'
      );
    });
  });
});
