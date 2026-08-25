import { Request, Response, NextFunction } from 'express';
import { supplierService } from '../services/supplier.service';

export class SupplierController {
  // SSR View Render: GET /master/suppliers
  async renderSuppliersPage(req: Request, res: Response, next: NextFunction) {
    try {
      const keyword = (req.query.keyword as string) || '';
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const paginationResult = await supplierService.getSuppliers({ keyword, page, limit });
      const successMsg = req.query.success as string;
      const errorMsg = req.query.error as string;

      res.render('supplier/views/suppliers', {
        title: 'Danh Mục Nhà Cung Cấp',
        currentNav: 'master-suppliers',
        suppliers: paginationResult.items,
        pagination: paginationResult,
        keyword,
        successMsg,
        errorMsg,
      });
    } catch (err) {
      next(err);
    }
  }

  // SSR Form Action: POST /master/suppliers (Create)
  async createSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, name, address, tax_code } = req.body;
      await supplierService.createSupplier({ code, name, address, tax_code });
      res.redirect('/master/suppliers?success=' + encodeURIComponent('Thêm mới nhà cung cấp thành công!'));
    } catch (err: any) {
      res.redirect('/master/suppliers?error=' + encodeURIComponent(err.message || 'Lỗi khi thêm mới nhà cung cấp'));
    }
  }

  // SSR Form Action: POST /master/suppliers/:id/update (Update)
  async updateSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { code, name, address, tax_code } = req.body;
      await supplierService.updateSupplier(id, { code, name, address, tax_code });
      res.redirect('/master/suppliers?success=' + encodeURIComponent('Cập nhật nhà cung cấp thành công!'));
    } catch (err: any) {
      res.redirect('/master/suppliers?error=' + encodeURIComponent(err.message || 'Lỗi khi cập nhật nhà cung cấp'));
    }
  }

  // SSR Form Action: POST /master/suppliers/:id/delete (Delete)
  async deleteSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await supplierService.deleteSupplier(id);
      res.redirect('/master/suppliers?success=' + encodeURIComponent('Xóa nhà cung cấp thành công!'));
    } catch (err: any) {
      res.redirect('/master/suppliers?error=' + encodeURIComponent(err.message || 'Lỗi khi xóa nhà cung cấp'));
    }
  }
}

export const supplierController = new SupplierController();
