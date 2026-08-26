import { Request, Response, NextFunction } from 'express';
import { receiptService, numberToVietnameseWords } from '../services/receipt.service';
import { warehouseService } from '../../warehouse/services/warehouse.service';
import { supplierService } from '../../supplier/services/supplier.service';
import { userService } from '../../user/services/user.service';
import { itemService } from '../../item/services/item.service';
import { unitService } from '../../unit/services/unit.service';
import { env } from '../../../config/environment';

export class ReceiptController {
  // SSR View Render: GET /receipts
  async renderReceiptList(req: Request, res: Response, next: NextFunction) {
    try {
      const paginatedData = await receiptService.getAllReceipts(req.query as any);
      const warehouses = await warehouseService.getWarehouses();
      const suppliers = await supplierService.getAllSuppliersList();

      res.render('receipt/views/list', {
        title: 'Danh Sách Phiếu Nhập Kho',
        currentNav: 'receipts',
        receipts: paginatedData.items,
        pagination: paginatedData,
        warehouses,
        suppliers,
        query: req.query,
      });
    } catch (err) {
      next(err);
    }
  }

  // SSR View Render: GET /receipts/create
  async renderReceiptCreate(req: Request, res: Response, next: NextFunction) {
    try {
      const warehouses = await warehouseService.getWarehouses();
      const suppliers = await supplierService.getAllSuppliersList();
      const items = await itemService.getAllItemsList();
      const units = await unitService.getUnits();
      const creators = await userService.getAllUsersList('creator');
      const keepers = await userService.getAllUsersList('keeper');
      const accountants = await userService.getAllUsersList('accountant');

      const nextReceiptNo = await receiptService.generateNextReceiptNo();
      const todayStr = new Date().toISOString().split('T')[0];

      res.render('receipt/views/create', {
        title: 'Lập Phiếu Nhập Kho Mới (Mẫu 01-VT)',
        currentNav: 'receipt-create',
        nextReceiptNo,
        todayStr,
        warehouses,
        suppliers,
        items,
        units,
        creators,
        keepers,
        accountants,
      });
    } catch (err) {
      next(err);
    }
  }

  // SSR Form Action / AJAX Submit: POST /receipts/create
  async handleCreateReceipt(req: Request, res: Response, next: NextFunction) {
    try {
      const newReceipt = await receiptService.createReceipt(req.body);
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(201).json({ success: true, data: newReceipt });
      }
      res.redirect(`/receipts/${newReceipt.id}`);
    } catch (err: any) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(400).json({ success: false, message: err.message || 'Lỗi lưu phiếu nhập kho' });
      }
      next(err);
    }
  }

  // SSR View Render: GET /receipts/:id
  async renderReceiptDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const receipt = await receiptService.getReceiptById(req.params.id as any);
      if (!receipt) {
        return res.status(404).render('pages/404', {
          title: 'Không tìm thấy phiếu nhập',
          message: `Không tìm thấy phiếu nhập kho với mã: ${req.params.id}`,
        });
      }

      const totalAmountWords = numberToVietnameseWords(receipt.total_amount);

      res.render('receipt/views/detail', {
        title: `Mẫu 01-VT - ${receipt.receipt_no}`,
        currentNav: 'receipts',
        receipt,
        totalAmountWords,
        companyName: env.COMPANY_NAME,
      });
    } catch (err) {
      next(err);
    }
  }

  // SSR Delete Action: POST /receipts/:id/delete
  async handleDeleteReceipt(req: Request, res: Response, next: NextFunction) {
    try {
      await receiptService.deleteReceipt(req.params.id as any);
      res.redirect('/receipts');
    } catch (err) {
      next(err);
    }
  }

  // SSR View Render: GET /receipts/:id/edit
  async renderReceiptEdit(req: Request, res: Response, next: NextFunction) {
    try {
      const receipt = await receiptService.getReceiptById(req.params.id as string);
      if (!receipt) {
        return res.status(404).render('pages/404', {
          title: 'Không tìm thấy phiếu nhập',
          message: `Không tìm thấy phiếu nhập kho với mã: ${req.params.id}`,
        });
      }

      if (receipt.status === 'PUBLIC') {
        return res.status(400).render('pages/error', {
          title: 'Không thể chỉnh sửa',
          message: 'Phiếu nhập kho đã ở trạng thái Phát Hành (PUBLIC), không thể chỉnh sửa.',
        });
      }

      const warehouses = await warehouseService.getWarehouses();
      const suppliers = await supplierService.getAllSuppliersList();
      const items = await itemService.getAllItemsList();
      const units = await unitService.getUnits();
      const creators = await userService.getAllUsersList('creator');
      const keepers = await userService.getAllUsersList('keeper');
      const accountants = await userService.getAllUsersList('accountant');

      res.render('receipt/views/create', {
        title: `Chỉnh Sửa Phiếu Nhập - ${receipt.receipt_no}`,
        currentNav: 'receipts',
        receipt,
        isEdit: true,
        nextReceiptNo: receipt.receipt_no,
        todayStr: receipt.receipt_date,
        warehouses,
        suppliers,
        items,
        units,
        creators,
        keepers,
        accountants,
      });
    } catch (err) {
      next(err);
    }
  }

  // SSR Form Action / AJAX Submit: POST /receipts/:id/edit
  async handleUpdateReceipt(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await receiptService.updateReceipt(req.params.id as string, req.body);
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.json({ success: true, data: updated });
      }
      res.redirect(`/receipts/${req.params.id}`);
    } catch (err: any) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(400).json({ success: false, message: err.message || 'Lỗi cập nhật phiếu nhập kho' });
      }
      next(err);
    }
  }

  // POST /receipts/:id/status
  async handleUpdateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const updated = await receiptService.updateStatus(req.params.id as string, status);
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.json({ success: true, data: updated });
      }
      res.redirect(`/receipts/${req.params.id}`);
    } catch (err: any) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(400).json({ success: false, message: err.message || 'Lỗi cập nhật trạng thái phiếu' });
      }
      next(err);
    }
  }
}

export const receiptController = new ReceiptController();
