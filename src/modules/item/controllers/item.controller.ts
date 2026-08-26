import { Request, Response, NextFunction } from 'express';
import { itemService } from '../services/item.service';
import { unitService } from '../../unit/services/unit.service';

export class ItemController {
  // Render trang giao diện danh sách: GET /admin/items
  async renderItemsPage(req: Request, res: Response, next: NextFunction) {
    try {
      const keyword = (req.query.keyword as string) || '';
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const paginationResult = await itemService.getItems({ keyword, page, limit });
      const units = await unitService.getUnits();
      const successMsg = req.query.success as string;
      const errorMsg = req.query.error as string;

      res.render('item/views/items', {
        title: 'Danh Mục Vật Tư - Hàng Hóa',
        currentNav: 'admin-items',
        items: paginationResult.items,
        pagination: paginationResult,
        units,
        keyword,
        successMsg,
        errorMsg,
      });
    } catch (err) {
      next(err);
    }
  }

  // Xử lý gửi Form: POST /admin/items (Tạo mới)
  async createItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, name, specifications, unit_id } = req.body;
      await itemService.createItem({ code, name, specifications, unit_id });
      res.redirect('/admin/items?success=' + encodeURIComponent('Thêm mới vật tư/hàng hóa thành công!'));
    } catch (err: any) {
      res.redirect('/admin/items?error=' + encodeURIComponent(err.message || 'Lỗi khi thêm mới vật tư/hàng hóa'));
    }
  }

  // Xử lý gửi Form: POST /admin/items/:id/update (Cập nhật)
  async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { code, name, specifications, unit_id } = req.body;
      await itemService.updateItem(id, { code, name, specifications, unit_id });
      res.redirect('/admin/items?success=' + encodeURIComponent('Cập nhật vật tư/hàng hóa thành công!'));
    } catch (err: any) {
      res.redirect('/admin/items?error=' + encodeURIComponent(err.message || 'Lỗi khi cập nhật vật tư/hàng hóa'));
    }
  }

  // Xử lý gửi Form: POST /admin/items/:id/delete (Xóa)
  async deleteItem(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await itemService.deleteItem(id);
      res.redirect('/admin/items?success=' + encodeURIComponent('Xóa vật tư/hàng hóa thành công!'));
    } catch (err: any) {
      res.redirect('/admin/items?error=' + encodeURIComponent(err.message || 'Lỗi khi xóa vật tư/hàng hóa'));
    }
  }
}

export const itemController = new ItemController();
