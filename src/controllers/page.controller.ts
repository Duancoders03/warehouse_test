import { Request, Response, NextFunction } from 'express';
import { receiptService, numberToVietnameseWords } from '../services/receipt.service';
import { masterDataService } from '../services/master-data.service';
import { env } from '../config/environment';

export class PageController {
  async renderDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const receipts = await receiptService.getAllReceipts();
      const items = await masterDataService.getItems();
      const warehouses = await masterDataService.getWarehouses();
      const suppliers = await masterDataService.getSuppliers();

      const totalAmount = receipts.reduce((acc, r) => acc + (r.total_amount || 0), 0);

      res.render('pages/dashboard', {
        title: 'Trang Chủ & Tổng Quan Kho',
        currentNav: 'dashboard',
        stats: {
          totalReceipts: receipts.length,
          totalAmount,
          itemsCount: items.length,
          warehousesCount: warehouses.length,
          suppliersCount: suppliers.length,
        },
        recentReceipts: receipts.slice(0, 5),
        companyName: env.COMPANY_NAME,
      });
    } catch (err) {
      next(err);
    }
  }

  async renderReceiptList(req: Request, res: Response, next: NextFunction) {
    try {
      const receipts = await receiptService.getAllReceipts(req.query as any);
      const warehouses = await masterDataService.getWarehouses();
      const suppliers = await masterDataService.getSuppliers();

      res.render('pages/receipts/list', {
        title: 'Danh Sách Phiếu Nhập Kho',
        currentNav: 'receipts',
        receipts,
        warehouses,
        suppliers,
        query: req.query,
      });
    } catch (err) {
      next(err);
    }
  }

  async renderReceiptCreate(req: Request, res: Response, next: NextFunction) {
    try {
      const warehouses = await masterDataService.getWarehouses();
      const suppliers = await masterDataService.getSuppliers();
      const items = await masterDataService.getItems();
      const units = await masterDataService.getUnits();
      const creators = await masterDataService.getEmployees('CREATOR');
      const keepers = await masterDataService.getEmployees('KEEPER');
      const accountants = await masterDataService.getEmployees('ACCOUNTANT');

      const nextReceiptNo = receiptService.generateNextReceiptNo();
      const todayStr = new Date().toISOString().split('T')[0];

      res.render('pages/receipts/create', {
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

      res.render('pages/receipts/detail', {
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

  async renderMasterItems(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await masterDataService.getItems();
      const units = await masterDataService.getUnits();
      res.render('pages/master/items', {
        title: 'Danh Mục Vật Tư - Hàng Hóa',
        currentNav: 'master-items',
        items,
        units,
      });
    } catch (err) {
      next(err);
    }
  }

  async renderMasterWarehouses(req: Request, res: Response, next: NextFunction) {
    try {
      const warehouses = await masterDataService.getWarehouses();
      res.render('pages/master/warehouses', {
        title: 'Danh Mục Kho Hàng',
        currentNav: 'master-warehouses',
        warehouses,
      });
    } catch (err) {
      next(err);
    }
  }

  async renderMasterSuppliers(req: Request, res: Response, next: NextFunction) {
    try {
      const suppliers = await masterDataService.getSuppliers();
      res.render('pages/master/suppliers', {
        title: 'Danh Mục Nhà Cung Cấp',
        currentNav: 'master-suppliers',
        suppliers,
      });
    } catch (err) {
      next(err);
    }
  }

  async renderMasterEmployees(req: Request, res: Response, next: NextFunction) {
    try {
      const employees = await masterDataService.getEmployees();
      const warehouses = await masterDataService.getWarehouses();
      res.render('pages/master/employees', {
        title: 'Danh Mục Nhân Viên / Vai Trò',
        currentNav: 'master-employees',
        employees,
        warehouses,
      });
    } catch (err) {
      next(err);
    }
  }

  async renderMasterUnits(req: Request, res: Response, next: NextFunction) {
    try {
      const units = await masterDataService.getUnits();
      res.render('pages/master/units', {
        title: 'Danh Mục Đơn Vị Tính',
        currentNav: 'master-units',
        units,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const pageController = new PageController();
