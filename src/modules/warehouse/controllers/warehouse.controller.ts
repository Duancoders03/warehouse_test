import { Request, Response, NextFunction } from 'express';
import { warehouseService } from '../services/warehouse.service';

export class WarehouseController {
  // SSR View Render: GET /master/warehouses
  async renderWarehousesPage(req: Request, res: Response, next: NextFunction) {
    try {
      const warehouses = await warehouseService.getWarehouses();
      res.render('warehouse/views/warehouses', {
        title: 'Danh Mục Kho Hàng',
        currentNav: 'master-warehouses',
        warehouses,
      });
    } catch (err) {
      next(err);
    }
  }

  // SSR Form Action: POST /master/warehouses
  async createWarehouse(req: Request, res: Response, next: NextFunction) {
    try {
      await warehouseService.createWarehouse(req.body);
      res.redirect('/master/warehouses');
    } catch (err) {
      next(err);
    }
  }
}

export const warehouseController = new WarehouseController();
