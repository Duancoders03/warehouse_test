import { Router } from 'express';
import { itemController } from '../controllers/item.controller';

const router = Router();

// SSR View Routes
router.get('/master/items', (req, res, next) => itemController.renderItemsPage(req, res, next));
router.post('/master/items', (req, res, next) => itemController.createItem(req, res, next));

export default router;
