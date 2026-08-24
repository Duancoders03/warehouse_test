import { Request, Response, NextFunction } from 'express';
import { receiptService } from '../services/receipt.service';

export class ReceiptController {
  async getReceiptsApi(req: Request, res: Response, next: NextFunction) {
    try {
      const receipts = await receiptService.getAllReceipts(req.query as any);
      res.json({ success: true, data: receipts });
    } catch (err) {
      next(err);
    }
  }

  async getReceiptByIdApi(req: Request, res: Response, next: NextFunction) {
    try {
      const receipt = await receiptService.getReceiptById(req.params.id);
      if (!receipt) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu nhập kho.' });
      }
      res.json({ success: true, data: receipt });
    } catch (err) {
      next(err);
    }
  }

  async createReceiptApi(req: Request, res: Response, next: NextFunction) {
    try {
      const receipt = await receiptService.createReceipt(req.body);
      res.status(201).json({
        success: true,
        message: 'Tạo mới phiếu nhập kho thành công!',
        data: receipt,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteReceiptApi(req: Request, res: Response, next: NextFunction) {
    try {
      const success = await receiptService.deleteReceipt(req.params.id);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu cần xóa.' });
      }
      res.json({ success: true, message: 'Đã xóa phiếu nhập kho.' });
    } catch (err) {
      next(err);
    }
  }
}

export const receiptController = new ReceiptController();
