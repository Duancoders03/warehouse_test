import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';

export class UserController {
  // SSR View Render: GET /master/users
  async renderUsersPage(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const keyword = (req.query.keyword as string) || '';
      const roleFilter = (req.query.role as string) || '';
      const successMsg = (req.query.success as string) || null;
      const errorMsg = (req.query.error as string) || null;

      const result = await userService.getUsers({
        keyword,
        role: roleFilter,
        page,
        limit: 10,
      });

      res.render('user/views/users', {
        title: 'Danh Mục Người Dùng / Vai Trò',
        currentNav: 'master-users',
        users: result.items,
        pagination: result,
        keyword,
        roleFilter,
        successMsg,
        errorMsg,
      });
    } catch (err) {
      next(err);
    }
  }

  // SSR Form Action: POST /master/users
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.createUser(req.body);
      res.redirect('/master/users?success=' + encodeURIComponent('Thêm mới người dùng thành công!'));
    } catch (err: any) {
      res.redirect('/master/users?error=' + encodeURIComponent(err.message || 'Không thể tạo người dùng.'));
    }
  }

  // SSR Form Action: POST /master/users/:id/update
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.updateUser(req.params.id as string, req.body);
      res.redirect('/master/users?success=' + encodeURIComponent('Cập nhật thông tin người dùng thành công!'));
    } catch (err: any) {
      res.redirect('/master/users?error=' + encodeURIComponent(err.message || 'Không thể cập nhật người dùng.'));
    }
  }

  // SSR Form Action: POST /master/users/:id/delete
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.deleteUser(req.params.id as string);
      res.redirect('/master/users?success=' + encodeURIComponent('Xóa người dùng thành công!'));
    } catch (err: any) {
      res.redirect('/master/users?error=' + encodeURIComponent(err.message || 'Không thể xóa người dùng.'));
    }
  }
}

export const userController = new UserController();
