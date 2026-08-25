import { Router } from 'express';
import { warehouseController } from '../controllers/warehouse.controller';

const router = Router();

// SSR View Routes
router.get('/master/warehouses', (req, res, next) => warehouseController.renderWarehousesPage(req, res, next));
router.post('/master/warehouses', (req, res, next) => warehouseController.createWarehouse(req, res, next));

export default router;
