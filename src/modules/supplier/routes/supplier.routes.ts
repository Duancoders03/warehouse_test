import { Router } from 'express';
import { supplierController } from '../controllers/supplier.controller';

const router = Router();

// SSR View Routes
router.get('/master/suppliers', (req, res, next) => supplierController.renderSuppliersPage(req, res, next));
router.post('/master/suppliers', (req, res, next) => supplierController.createSupplier(req, res, next));

export default router;
