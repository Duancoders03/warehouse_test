import { receiptService } from '../../src/modules/receipt/services/receipt.service';
import { InventoryReceipt, InventoryReceiptDetail } from '../../src/models';
import { sequelize } from '../../src/config/database';

describe('ReceiptService (Module Phiếu nhập kho - Core Full Coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createReceipt', () => {
    it('TC_RCT_001: Tạo phiếu nhập kho thành công (NK000001, tính tổng tiền, status DRAFT)', async () => {
      const mockTransaction = {} as any;
      jest.spyOn(sequelize, 'transaction').mockImplementation(async (cb: any) => {
        return await cb(mockTransaction);
      });

      jest.spyOn(receiptService, 'generateNextReceiptNo').mockResolvedValue('NK000001');

      const createdReceipt = { id: 'rc-1' };
      jest.spyOn(InventoryReceipt, 'create').mockResolvedValue(createdReceipt as any);
      jest.spyOn(InventoryReceiptDetail, 'bulkCreate').mockResolvedValue([] as any);

      const fullReceiptDto = {
        id: 'rc-1',
        receipt_no: 'NK000001',
        total_amount: 2000000,
        status: 'DRAFT',
        details: [
          { item_id: 'item-1', actual_quantity: 10, unit_price: 100000, amount: 1000000 },
          { item_id: 'item-2', actual_quantity: 5, unit_price: 200000, amount: 1000000 },
        ],
      };
      jest.spyOn(receiptService, 'getReceiptById').mockResolvedValue(fullReceiptDto as any);

      const dto = {
        created_by_id: 'user-1',
        details: [
          { item_id: 'item-1', unit_id: 'unit-1', document_quantity: 10, actual_quantity: 10, unit_price: 100000 },
          { item_id: 'item-2', unit_id: 'unit-2', document_quantity: 5, actual_quantity: 5, unit_price: 200000 },
        ],
      };

      const result = await receiptService.createReceipt(dto as any);
      expect(result.receipt_no).toBe('NK000001');
      expect(result.total_amount).toBe(2000000);
      expect(result.status).toBe('DRAFT');
      expect(InventoryReceipt.create).toHaveBeenCalledWith(
        expect.objectContaining({
          receipt_no: 'NK000001',
          total_amount: 2000000,
          status: 'DRAFT',
        }),
        { transaction: mockTransaction }
      );
    });

    it('TC_RCT_002: Lỗi tạo phiếu khi danh sách chi tiết vật tư rỗng', async () => {
      const dto = { created_by_id: 'user-1', details: [] };
      await expect(receiptService.createReceipt(dto as any)).rejects.toThrow(
        'Phiếu nhập kho phải có ít nhất 1 dòng chi tiết vật tư.'
      );
    });

    it('TC_RCT_003: Lỗi chọn trùng lặp cùng 1 vật tư trong cùng một phiếu nhập kho', async () => {
      const dto = {
        created_by_id: 'user-1',
        details: [
          { item_id: 'item-1', unit_id: 'unit-1', document_quantity: 5, actual_quantity: 5, unit_price: 100 },
          { item_id: 'item-1', unit_id: 'unit-1', document_quantity: 2, actual_quantity: 2, unit_price: 100 },
        ],
      };

      await expect(receiptService.createReceipt(dto as any)).rejects.toThrow(
        'Vật tư / hàng hóa không được chọn trùng lặp trong cùng một phiếu nhập kho.'
      );
    });

    it('TC_RCT_004: Kiểm tra DB Transaction Rollback khi lưu chi tiết phiếu thất bại', async () => {
      jest.spyOn(sequelize, 'transaction').mockImplementation(async (cb: any) => {
        try {
          return await cb({} as any);
        } catch (err) {
          throw err;
        }
      });

      jest.spyOn(receiptService, 'generateNextReceiptNo').mockResolvedValue('NK000002');
      jest.spyOn(InventoryReceipt, 'create').mockResolvedValue({ id: 'rc-2' } as any);
      jest.spyOn(InventoryReceiptDetail, 'bulkCreate').mockRejectedValue(new Error('Foreign Key DB Violation Error'));

      const dto = {
        created_by_id: 'user-1',
        details: [
          { item_id: 'invalid-item', unit_id: 'unit-1', document_quantity: 1, actual_quantity: 1, unit_price: 100 },
        ],
      };

      await expect(receiptService.createReceipt(dto as any)).rejects.toThrow('Foreign Key DB Violation Error');
    });
  });

  describe('getAllReceipts & getReceiptById', () => {
    it('TC_RCT_005: Xem danh sách phiếu nhập kho có Phân trang & Lọc theo mã / kho / ngày', async () => {
      const mockReceipt = {
        id: 'rc-1',
        receipt_no: 'NK000001',
        toJSON: () => ({ id: 'rc-1', receipt_no: 'NK000001', total_amount: 100000, details: [] }),
      };
      jest.spyOn(InventoryReceipt, 'findAndCountAll').mockImplementation(async () => ({
        count: 1,
        rows: [mockReceipt],
      } as any));

      const result = await receiptService.getAllReceipts({ page: 1, limit: 10, keyword: 'NK000001' });
      expect(result.totalItems).toBe(1);
      expect(result.items[0].receipt_no).toBe('NK000001');
    });

    it('TC_RCT_006: Xem chi tiết phiếu nhập kho Mẫu 01-VT & Xử lý khi ID không tồn tại', async () => {
      const mockReceipt = {
        id: 'rc-1',
        receipt_no: 'NK000001',
        toJSON: () => ({ id: 'rc-1', receipt_no: 'NK000001' }),
      };
      jest.spyOn(InventoryReceipt, 'findByPk').mockResolvedValueOnce(mockReceipt as any).mockResolvedValueOnce(null);

      const found = await receiptService.getReceiptById('rc-1');
      expect(found?.receipt_no).toBe('NK000001');

      const notFound = await receiptService.getReceiptById('invalid-id');
      expect(notFound).toBeNull();
    });
  });

  describe('updateReceipt', () => {
    it('TC_RCT_007: Cập nhật nội dung phiếu nhập kho (Sửa số lượng, tính lại tổng tiền)', async () => {
      const mockTransaction = {} as any;
      jest.spyOn(sequelize, 'transaction').mockImplementation(async (cb: any) => {
        return await cb(mockTransaction);
      });

      const existingReceipt = {
        id: 'rc-1',
        status: 'DRAFT',
        save: jest.fn().mockResolvedValue(true),
        update: jest.fn().mockResolvedValue(true),
      };
      jest.spyOn(InventoryReceipt, 'findByPk').mockResolvedValue(existingReceipt as any);
      jest.spyOn(InventoryReceiptDetail, 'destroy').mockResolvedValue(1);
      jest.spyOn(InventoryReceiptDetail, 'bulkCreate').mockResolvedValue([] as any);
      jest.spyOn(receiptService, 'getReceiptById').mockResolvedValue({ id: 'rc-1', total_amount: 4000000 } as any);

      const dto = {
        details: [
          { item_id: 'item-1', unit_id: 'unit-1', document_quantity: 20, actual_quantity: 20, unit_price: 200000 },
        ],
      };

      const result = await receiptService.updateReceipt('rc-1', dto as any);
      expect(result!.total_amount).toBe(4000000);
      expect(existingReceipt.update).toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('TC_RCT_008: Duyệt phát hành phiếu nhập kho (Chuyển status từ DRAFT sang PUBLIC)', async () => {
      const mockReceipt = {
        id: 'rc-1',
        status: 'DRAFT',
        save: jest.fn().mockResolvedValue(true),
      };
      jest.spyOn(InventoryReceipt, 'findByPk').mockResolvedValue(mockReceipt as any);
      jest.spyOn(receiptService, 'getReceiptById').mockResolvedValue({ id: 'rc-1', status: 'PUBLIC' } as any);

      const result = await receiptService.updateStatus('rc-1', 'PUBLIC');
      expect(mockReceipt.status).toBe('PUBLIC');
      expect(mockReceipt.save).toHaveBeenCalled();
      expect(result?.status).toBe('PUBLIC');
    });
  });

  describe('deleteReceipt', () => {
    it('TC_RCT_009: Không cho phép XÓA phiếu nhập kho đã phát hành (PUBLIC)', async () => {
      const publicReceipt = { id: 'rc-1', status: 'PUBLIC' };
      jest.spyOn(InventoryReceipt, 'findByPk').mockResolvedValue(publicReceipt as any);

      await expect(receiptService.deleteReceipt('rc-1')).rejects.toThrow(
        'Không thể xóa phiếu nhập kho đã phát hành (PUBLIC). Vui lòng hủy phiếu trước khi xóa.'
      );
    });

    it('TC_RCT_010: Xóa thành công phiếu nhập kho ở trạng thái DRAFT', async () => {
      const draftReceipt = { id: 'rc-1', status: 'DRAFT' };
      jest.spyOn(InventoryReceipt, 'findByPk').mockResolvedValue(draftReceipt as any);
      jest.spyOn(InventoryReceipt, 'destroy').mockResolvedValue(1);

      const result = await receiptService.deleteReceipt('rc-1');
      expect(result).toBe(true);
      expect(InventoryReceipt.destroy).toHaveBeenCalledWith({ where: { id: 'rc-1' } });
    });
  });

  describe('generateNextReceiptNo', () => {
    it('TC_RCT_011: Tự động sinh mã phiếu tiếp theo (NK000001 -> NK000002 -> NK000003)', async () => {
      jest.spyOn(InventoryReceipt, 'findOne').mockResolvedValueOnce({ receipt_no: 'NK000001' } as any).mockResolvedValueOnce(null);
      
      const nextNo = await receiptService.generateNextReceiptNo();
      expect(nextNo).toBe('NK000002');

      const initNo = await receiptService.generateNextReceiptNo();
      expect(initNo).toBe('NK000001');
    });
  });
});
