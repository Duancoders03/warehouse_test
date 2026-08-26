import { Router } from 'express';
import { unitController } from '../controllers/unit.controller';

const router = Router();

// Route hiển thị giao diện (SSR) & thao tác CRUD đơn vị tính
router.get('/admin/units', (req, res, next) => unitController.renderUnitsPage(req, res, next));
router.post('/admin/units', (req, res, next) => unitController.createUnit(req, res, next));
router.post('/admin/units/:id/update', (req, res, next) => unitController.updateUnit(req, res, next));
router.post('/admin/units/:id/delete', (req, res, next) => unitController.deleteUnit(req, res, next));

export default router;
