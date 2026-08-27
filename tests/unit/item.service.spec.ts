import { itemService } from '../../src/modules/item/services/item.service';
import { Item } from '../../src/models';

describe('ItemService (Module Vật tư / Hàng hóa - Full Coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createItem', () => {
    it('TC_ITM_001: Tạo mới vật tư liên kết Đơn vị tính hợp lệ', async () => {
      const dto = { code: 'vt001', name: 'Thép D10', unit_id: 'unit-uuid-1' };
      const createdItem = {
        id: 'item-uuid-1',
        code: 'VT001',
        name: 'Thép D10',
        unit_id: 'unit-uuid-1',
      };
      const fullItem = {
        ...createdItem,
        unit: { id: 'unit-uuid-1', name: 'Cái' },
        toJSON: () => ({ ...createdItem, unit: { id: 'unit-uuid-1', name: 'Cái' } }),
      };

      jest.spyOn(Item, 'create').mockResolvedValue(createdItem as any);
      jest.spyOn(Item, 'findByPk').mockResolvedValue(fullItem as any);

      const result = await itemService.createItem(dto);
      expect(result.code).toBe('VT001');
      expect(result.name).toBe('Thép D10');
      expect(result.unit?.name).toBe('Cái');
    });

    it('TC_ITM_002: Lỗi khi tạo trùng mã vật tư đã tồn tại', async () => {
      jest.spyOn(Item, 'create').mockRejectedValue(new Error('Mã vật tư/hàng hóa đã tồn tại trong hệ thống'));

      await expect(
        itemService.createItem({ code: 'VT001', name: 'Thép D10', unit_id: 'unit-uuid-1' })
      ).rejects.toThrow('Mã vật tư/hàng hóa đã tồn tại trong hệ thống');
    });
  });

  describe('getItems & getItemById & getAllItemsList', () => {
    it('TC_ITM_003: Xem danh sách vật tư Phân trang & Tìm kiếm quy cách / tên', async () => {
      const mockRows = [
        { id: '1', code: 'VT001', name: 'Thép D10', toJSON: () => ({ id: '1', code: 'VT001', name: 'Thép D10' }) }
      ];
      jest.spyOn(Item, 'findAndCountAll').mockResolvedValue({ count: 1, rows: mockRows } as any);

      const paginated = await itemService.getItems({ keyword: 'Thép D10', page: 1 });
      expect(paginated.items).toHaveLength(1);
      expect(paginated.totalItems).toBe(1);

      jest.spyOn(Item, 'findAll').mockResolvedValue(mockRows as any);
      const list = await itemService.getAllItemsList();
      expect(list).toHaveLength(1);
    });
  });

  describe('updateItem & deleteItem', () => {
    it('TC_ITM_004: Cập nhật & Xóa vật tư (Kiểm tra cả trường hợp ID rác không tồn tại)', async () => {
      const existing = {
        id: '1',
        code: 'VT001',
        name: 'Thép D10',
        save: jest.fn().mockResolvedValue(true),
        destroy: jest.fn().mockResolvedValue(true),
        toJSON: () => ({ id: '1', code: 'VT001', name: 'Thép D10 Sửa' }),
      };
      jest.spyOn(Item, 'findByPk').mockResolvedValueOnce(existing as any).mockResolvedValueOnce(existing as any);

      const updated = await itemService.updateItem('1', { name: 'Thép D10 Sửa' });
      expect(updated.name).toBe('Thép D10 Sửa');

      jest.spyOn(Item, 'findByPk').mockResolvedValueOnce(null);
      await expect(itemService.updateItem('invalid-id', { name: 'Test' })).rejects.toThrow(
        'Không tìm thấy vật tư/hàng hóa cần cập nhật.'
      );

      jest.spyOn(Item, 'findByPk').mockResolvedValueOnce(existing as any).mockResolvedValueOnce(null);
      const deleted = await itemService.deleteItem('1');
      expect(deleted).toBe(true);

      await expect(itemService.deleteItem('invalid-id')).rejects.toThrow(
        'Không tìm thấy vật tư/hàng hóa cần xóa.'
      );
    });
  });
});
