import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { warehouseService } from '../../warehouse/services/warehouse.service';

export class UserController {
  // SSR View Render: GET /master/users
  async renderUsersPage(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getUsers();
      const warehouses = await warehouseService.getWarehouses();
      res.render('user/views/users', {
        title: 'Danh Mục Người Dùng / Vai Trò',
        currentNav: 'master-users',
        users,
        warehouses,
      });
    } catch (err) {
      next(err);
    }
  }

  // SSR Form Action: POST /master/users
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.createUser(req.body);
      res.redirect('/master/users');
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();
