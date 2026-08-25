import { Request, Response, NextFunction } from 'express';
import { warehouseService } from '../services/warehouse.service';

export class WarehouseController {
  // SSR View Render: GET /master/warehouses
  async renderWarehousesPage(req: Request, res: Response, next: NextFunction) {
    try {
      const keyword = (req.query.keyword as string) || '';
      const warehouses = await warehouseService.getWarehouses(keyword);
      const successMsg = req.query.success as string;
      const errorMsg = req.query.error as string;

      res.render('warehouse/views/warehouses', {
        title: 'Danh Mục Kho Hàng',
        currentNav: 'master-warehouses',
        warehouses,
        keyword,
        successMsg,
        errorMsg,
      });
    } catch (err) {
      next(err);
    }
  }

  // SSR Form Action: POST /master/warehouses (Create)
  async createWarehouse(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, name, address } = req.body;
      await warehouseService.createWarehouse({ code, name, address });
      res.redirect('/master/warehouses?success=' + encodeURIComponent('Thêm mới kho hàng thành công!'));
    } catch (err: any) {
      res.redirect('/master/warehouses?error=' + encodeURIComponent(err.message || 'Lỗi khi thêm mới kho hàng'));
    }
  }

  // SSR Form Action: POST /master/warehouses/:id/update (Update)
  async updateWarehouse(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { code, name, address } = req.body;
      await warehouseService.updateWarehouse(id, { code, name, address });
      res.redirect('/master/warehouses?success=' + encodeURIComponent('Cập nhật kho hàng thành công!'));
    } catch (err: any) {
      res.redirect('/master/warehouses?error=' + encodeURIComponent(err.message || 'Lỗi khi cập nhật kho hàng'));
    }
  }

  // SSR Form Action: POST /master/warehouses/:id/delete (Delete)
  async deleteWarehouse(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await warehouseService.deleteWarehouse(id);
      res.redirect('/master/warehouses?success=' + encodeURIComponent('Xóa kho hàng thành công!'));
    } catch (err: any) {
      res.redirect('/master/warehouses?error=' + encodeURIComponent(err.message || 'Lỗi khi xóa kho hàng'));
    }
  }
}

export const warehouseController = new WarehouseController();
