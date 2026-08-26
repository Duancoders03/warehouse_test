import { Router } from 'express';
import { userController } from '../controllers/user.controller';

const router = Router();

// Route hiển thị giao diện (SSR) & thao tác CRUD người dùng
router.get('/admin/users', (req, res, next) => userController.renderUsersPage(req, res, next));
router.post('/admin/users', (req, res, next) => userController.createUser(req, res, next));
router.post('/admin/users/:id/update', (req, res, next) => userController.updateUser(req, res, next));
router.post('/admin/users/:id/delete', (req, res, next) => userController.deleteUser(req, res, next));

export default router;
