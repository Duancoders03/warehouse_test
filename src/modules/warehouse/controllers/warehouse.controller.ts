import { Request, Response, NextFunction } from 'express';
import { warehouseService } from '../services/warehouse.service';

export class WarehouseController {
  // Render trang giao diện danh sách: GET /admin/warehouses
  async renderWarehousesPage(req: Request, res: Response, next: NextFunction) {
    try {
      const keyword = (req.query.keyword as string) || '';
      const warehouses = await warehouseService.getWarehouses(keyword);
      const successMsg = req.query.success as string;
      const errorMsg = req.query.error as string;

      res.render('warehouse/views/warehouses', {
        title: 'Danh Mục Kho Hàng',
        currentNav: 'admin-warehouses',
        warehouses,
        keyword,
        successMsg,
        errorMsg,
      });
    } catch (err) {
      next(err);
    }
  }

  // Xử lý gửi Form: POST /admin/warehouses (Tạo mới)
  async createWarehouse(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, name, address } = req.body;
      await warehouseService.createWarehouse({ code, name, address });
      res.redirect('/admin/warehouses?success=' + encodeURIComponent('Thêm mới kho hàng thành công!'));
    } catch (err: any) {
      res.redirect('/admin/warehouses?error=' + encodeURIComponent(err.message || 'Lỗi khi thêm mới kho hàng'));
    }
  }

  // Xử lý gửi Form: POST /admin/warehouses/:id/update (Cập nhật)
  async updateWarehouse(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { code, name, address } = req.body;
      await warehouseService.updateWarehouse(id, { code, name, address });
      res.redirect('/admin/warehouses?success=' + encodeURIComponent('Cập nhật kho hàng thành công!'));
    } catch (err: any) {
      res.redirect('/admin/warehouses?error=' + encodeURIComponent(err.message || 'Lỗi khi cập nhật kho hàng'));
    }
  }

  // Xử lý gửi Form: POST /admin/warehouses/:id/delete (Xóa)
  async deleteWarehouse(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await warehouseService.deleteWarehouse(id);
      res.redirect('/admin/warehouses?success=' + encodeURIComponent('Xóa kho hàng thành công!'));
    } catch (err: any) {
      res.redirect('/admin/warehouses?error=' + encodeURIComponent(err.message || 'Lỗi khi xóa kho hàng'));
    }
  }
}

export const warehouseController = new WarehouseController();
