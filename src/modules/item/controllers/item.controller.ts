import { Request, Response, NextFunction } from 'express';
import { itemService } from '../services/item.service';
import { unitService } from '../../unit/services/unit.service';

export class ItemController {
  // SSR View Render: GET /master/items
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
        currentNav: 'master-items',
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

  // SSR Form Action: POST /master/items (Create)
  async createItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, name, specifications, unit_id } = req.body;
      await itemService.createItem({ code, name, specifications, unit_id });
      res.redirect('/master/items?success=' + encodeURIComponent('Thêm mới vật tư/hàng hóa thành công!'));
    } catch (err: any) {
      res.redirect('/master/items?error=' + encodeURIComponent(err.message || 'Lỗi khi thêm mới vật tư/hàng hóa'));
    }
  }

  // SSR Form Action: POST /master/items/:id/update (Update)
  async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { code, name, specifications, unit_id } = req.body;
      await itemService.updateItem(id, { code, name, specifications, unit_id });
      res.redirect('/master/items?success=' + encodeURIComponent('Cập nhật vật tư/hàng hóa thành công!'));
    } catch (err: any) {
      res.redirect('/master/items?error=' + encodeURIComponent(err.message || 'Lỗi khi cập nhật vật tư/hàng hóa'));
    }
  }

  // SSR Form Action: POST /master/items/:id/delete (Delete)
  async deleteItem(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await itemService.deleteItem(id);
      res.redirect('/master/items?success=' + encodeURIComponent('Xóa vật tư/hàng hóa thành công!'));
    } catch (err: any) {
      res.redirect('/master/items?error=' + encodeURIComponent(err.message || 'Lỗi khi xóa vật tư/hàng hóa'));
    }
  }
}

export const itemController = new ItemController();
