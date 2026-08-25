import { Router } from 'express';
import { warehouseController } from '../controllers/warehouse.controller';

const router = Router();

// SSR View & CRUD Form Actions
router.get('/master/warehouses', (req, res, next) => warehouseController.renderWarehousesPage(req, res, next));
router.post('/master/warehouses', (req, res, next) => warehouseController.createWarehouse(req, res, next));
router.post('/master/warehouses/:id/update', (req, res, next) => warehouseController.updateWarehouse(req, res, next));
router.post('/master/warehouses/:id/delete', (req, res, next) => warehouseController.deleteWarehouse(req, res, next));

export default router;
