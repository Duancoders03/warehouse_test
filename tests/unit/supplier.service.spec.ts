import { supplierService } from '../../src/modules/supplier/services/supplier.service';
import { Supplier } from '../../src/models';

describe('SupplierService (Module Nhà cung cấp - Full Coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSupplier', () => {
    it('TC_SUP_001: Tạo Nhà cung cấp đầy đủ thông tin hợp lệ', async () => {
      const dto = { code: 'ncc001', name: 'Công ty THACO', tax_code: '0101234567', address: 'Hà Nội' };
      const created = {
        id: '1',
        code: 'NCC001',
        name: 'Công ty THACO',
        tax_code: '0101234567',
        address: 'Hà Nội',
        toJSON: () => ({ id: '1', code: 'NCC001', name: 'Công ty THACO', tax_code: '0101234567', address: 'Hà Nội' }),
      };
      jest.spyOn(Supplier, 'create').mockResolvedValue(created as any);

      const result = await supplierService.createSupplier(dto);
      expect(result.code).toBe('NCC001');
      expect(result.name).toBe('Công ty THACO');
    });
  });

  describe('getSuppliers & getSupplierById', () => {
    it('TC_SUP_002: Xem danh sách Nhà cung cấp có Phân trang & Tìm kiếm từ khóa', async () => {
      const mockRows = [
        { id: '1', code: 'NCC001', name: 'Công ty THACO', toJSON: () => ({ id: '1', code: 'NCC001', name: 'Công ty THACO' }) }
      ];
      jest.spyOn(Supplier, 'findAndCountAll').mockResolvedValue({ count: 1, rows: mockRows } as any);

      const result = await supplierService.getSuppliers({ keyword: 'THACO', page: 1, limit: 10 });
      expect(result.items).toHaveLength(1);
      expect(result.totalItems).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('TC_SUP_003: Lấy tất cả danh sách Nhà cung cấp dạng mảng đơn đơn giản (Dropdown list)', async () => {
      const mockList = [
        { id: '1', code: 'NCC001', name: 'Công ty A', toJSON: () => ({ id: '1', code: 'NCC001' }) },
        { id: '2', code: 'NCC002', name: 'Công ty B', toJSON: () => ({ id: '2', code: 'NCC002' }) },
      ];
      jest.spyOn(Supplier, 'findAll').mockResolvedValue(mockList as any);

      const result = await supplierService.getAllSuppliersList();
      expect(result).toHaveLength(2);
    });
  });

  describe('updateSupplier & deleteSupplier', () => {
    it('TC_SUP_004: Cập nhật & Xóa Nhà cung cấp (Kiểm tra cả trường hợp ID không tồn tại)', async () => {
      const existing = {
        id: '1',
        code: 'NCC001',
        name: 'Công ty A',
        save: jest.fn().mockResolvedValue(true),
        destroy: jest.fn().mockResolvedValue(true),
        toJSON: () => ({ id: '1', code: 'NCC001', name: 'Công ty A đã sửa' }),
      };
      jest.spyOn(Supplier, 'findByPk').mockResolvedValueOnce(existing as any).mockResolvedValueOnce(null);

      const updated = await supplierService.updateSupplier('1', { name: 'Công ty A đã sửa' });
      expect(updated.name).toBe('Công ty A đã sửa');

      await expect(supplierService.updateSupplier('invalid-id', { name: 'Test' })).rejects.toThrow(
        'Không tìm thấy nhà cung cấp cần cập nhật.'
      );

      jest.spyOn(Supplier, 'findByPk').mockResolvedValueOnce(existing as any).mockResolvedValueOnce(null);
      const deleted = await supplierService.deleteSupplier('1');
      expect(deleted).toBe(true);

      await expect(supplierService.deleteSupplier('invalid-id')).rejects.toThrow(
        'Không tìm thấy nhà cung cấp cần xóa.'
      );
    });
  });
});
