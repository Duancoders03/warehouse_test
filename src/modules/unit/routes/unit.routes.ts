import { Router } from 'express';
import { unitController } from '../controllers/unit.controller';

const router = Router();

// SSR View & CRUD Form Actions
router.get('/master/units', (req, res, next) => unitController.renderUnitsPage(req, res, next));
router.post('/master/units', (req, res, next) => unitController.createUnit(req, res, next));
router.post('/master/units/:id/update', (req, res, next) => unitController.updateUnit(req, res, next));
router.post('/master/units/:id/delete', (req, res, next) => unitController.deleteUnit(req, res, next));

export default router;
