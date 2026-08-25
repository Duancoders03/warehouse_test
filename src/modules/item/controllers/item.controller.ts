import { Request, Response, NextFunction } from 'express';
import { itemService } from '../services/item.service';
import { unitService } from '../../unit/services/unit.service';

export class ItemController {
  // SSR View Render: GET /master/items
  async renderItemsPage(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await itemService.getItems();
      const units = await unitService.getUnits();
      res.render('item/views/items', {
        title: 'Danh Mục Vật Tư - Hàng Hóa',
        currentNav: 'master-items',
        items,
        units,
      });
    } catch (err) {
      next(err);
    }
  }

  // SSR Form Action: POST /master/items
  async createItem(req: Request, res: Response, next: NextFunction) {
    try {
      await itemService.createItem(req.body);
      res.redirect('/master/items');
    } catch (err) {
      next(err);
    }
  }
}

export const itemController = new ItemController();
