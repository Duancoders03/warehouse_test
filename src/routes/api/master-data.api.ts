import { Router } from 'express';
import { masterDataController } from '../../controllers/master-data.controller';

const router = Router();

router.get('/units', (req, res) => masterDataController.getUnits(req, res));
router.get('/warehouses', (req, res) => masterDataController.getWarehouses(req, res));
router.get('/suppliers', (req, res) => masterDataController.getSuppliers(req, res));
router.get('/employees', (req, res) => masterDataController.getEmployees(req, res));
router.get('/items', (req, res) => masterDataController.getItems(req, res));

export default router;
