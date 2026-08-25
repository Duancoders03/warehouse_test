import { Request, Response, NextFunction } from 'express';
import { supplierService } from '../services/supplier.service';

export class SupplierController {
  // SSR View Render: GET /master/suppliers
  async renderSuppliersPage(req: Request, res: Response, next: NextFunction) {
    try {
      const suppliers = await supplierService.getSuppliers();
      res.render('supplier/views/suppliers', {
        title: 'Danh Mục Nhà Cung Cấp',
        currentNav: 'master-suppliers',
        suppliers,
      });
    } catch (err) {
      next(err);
    }
  }

  // SSR Form Action: POST /master/suppliers
  async createSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      await supplierService.createSupplier(req.body);
      res.redirect('/master/suppliers');
    } catch (err) {
      next(err);
    }
  }
}

export const supplierController = new SupplierController();
