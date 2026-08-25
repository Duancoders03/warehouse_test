import { Router } from 'express';
import { itemController } from '../controllers/item.controller';

const router = Router();

// SSR View & CRUD Form Actions
router.get('/master/items', (req, res, next) => itemController.renderItemsPage(req, res, next));
router.post('/master/items', (req, res, next) => itemController.createItem(req, res, next));
router.post('/master/items/:id/update', (req, res, next) => itemController.updateItem(req, res, next));
router.post('/master/items/:id/delete', (req, res, next) => itemController.deleteItem(req, res, next));

export default router;
