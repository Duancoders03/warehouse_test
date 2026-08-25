import { Router } from 'express';
import { unitController } from '../controllers/unit.controller';

const router = Router();

// SSR View Routes
router.get('/master/units', (req, res, next) => unitController.renderUnitsPage(req, res, next));
router.post('/master/units', (req, res, next) => unitController.createUnit(req, res, next));

export default router;
