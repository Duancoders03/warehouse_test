import { Router } from 'express';
import { itemController } from '../controllers/item.controller';

const router = Router();

// Route hiển thị giao diện (SSR) & thao tác CRUD vật tư / hàng hóa
router.get('/admin/items', (req, res, next) => itemController.renderItemsPage(req, res, next));
router.post('/admin/items', (req, res, next) => itemController.createItem(req, res, next));
router.post('/admin/items/:id/update', (req, res, next) => itemController.updateItem(req, res, next));
router.post('/admin/items/:id/delete', (req, res, next) => itemController.deleteItem(req, res, next));

export default router;
