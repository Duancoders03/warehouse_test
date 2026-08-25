import { Router } from 'express';
import { supplierController } from '../controllers/supplier.controller';

const router = Router();

// SSR View & CRUD Form Actions
router.get('/master/suppliers', (req, res, next) => supplierController.renderSuppliersPage(req, res, next));
router.post('/master/suppliers', (req, res, next) => supplierController.createSupplier(req, res, next));
router.post('/master/suppliers/:id/update', (req, res, next) => supplierController.updateSupplier(req, res, next));
router.post('/master/suppliers/:id/delete', (req, res, next) => supplierController.deleteSupplier(req, res, next));

export default router;
