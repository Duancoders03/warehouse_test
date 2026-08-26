import { Router } from 'express';
import { supplierController } from '../controllers/supplier.controller';

const router = Router();

// Route hiển thị giao diện (SSR) & thao tác CRUD nhà cung cấp
router.get('/admin/suppliers', (req, res, next) => supplierController.renderSuppliersPage(req, res, next));
router.post('/admin/suppliers', (req, res, next) => supplierController.createSupplier(req, res, next));
router.post('/admin/suppliers/:id/update', (req, res, next) => supplierController.updateSupplier(req, res, next));
router.post('/admin/suppliers/:id/delete', (req, res, next) => supplierController.deleteSupplier(req, res, next));

export default router;
