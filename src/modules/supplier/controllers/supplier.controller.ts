import { Request, Response, NextFunction } from 'express';
import { supplierService } from '../services/supplier.service';

export class SupplierController {
  // Render trang giao diện danh sách: GET /admin/suppliers
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
        currentNav: 'admin-suppliers',
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

  // Xử lý gửi Form: POST /admin/suppliers (Tạo mới)
  async createSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, name, address, tax_code } = req.body;
      await supplierService.createSupplier({ code, name, address, tax_code });
      res.redirect('/admin/suppliers?success=' + encodeURIComponent('Thêm mới nhà cung cấp thành công!'));
    } catch (err: any) {
      res.redirect('/admin/suppliers?error=' + encodeURIComponent(err.message || 'Lỗi khi thêm mới nhà cung cấp'));
    }
  }

  // Xử lý gửi Form: POST /admin/suppliers/:id/update (Cập nhật)
  async updateSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { code, name, address, tax_code } = req.body;
      await supplierService.updateSupplier(id, { code, name, address, tax_code });
      res.redirect('/admin/suppliers?success=' + encodeURIComponent('Cập nhật nhà cung cấp thành công!'));
    } catch (err: any) {
      res.redirect('/admin/suppliers?error=' + encodeURIComponent(err.message || 'Lỗi khi cập nhật nhà cung cấp'));
    }
  }

  // Xử lý gửi Form: POST /admin/suppliers/:id/delete (Xóa)
  async deleteSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await supplierService.deleteSupplier(id);
      res.redirect('/admin/suppliers?success=' + encodeURIComponent('Xóa nhà cung cấp thành công!'));
    } catch (err: any) {
      res.redirect('/admin/suppliers?error=' + encodeURIComponent(err.message || 'Lỗi khi xóa nhà cung cấp'));
    }
  }
}

export const supplierController = new SupplierController();
