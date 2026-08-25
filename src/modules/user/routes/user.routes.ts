import { Router } from 'express';
import { userController } from '../controllers/user.controller';

const router = Router();

// SSR View Routes
router.get('/master/users', (req, res, next) => userController.renderUsersPage(req, res, next));
router.post('/master/users', (req, res, next) => userController.createUser(req, res, next));

export default router;
