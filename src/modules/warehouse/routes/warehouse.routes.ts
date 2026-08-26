import { Router } from 'express';
import { warehouseController } from '../controllers/warehouse.controller';

const router = Router();

// Route hiển thị giao diện (SSR) & thao tác CRUD kho hàng
router.get('/admin/warehouses', (req, res, next) => warehouseController.renderWarehousesPage(req, res, next));
router.post('/admin/warehouses', (req, res, next) => warehouseController.createWarehouse(req, res, next));
router.post('/admin/warehouses/:id/update', (req, res, next) => warehouseController.updateWarehouse(req, res, next));
router.post('/admin/warehouses/:id/delete', (req, res, next) => warehouseController.deleteWarehouse(req, res, next));

export default router;
