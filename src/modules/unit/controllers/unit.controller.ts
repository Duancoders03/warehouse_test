import { Request, Response, NextFunction } from 'express';
import { unitService } from '../services/unit.service';

export class UnitController {
  // SSR View Render: GET /master/units
  async renderUnitsPage(req: Request, res: Response, next: NextFunction) {
    try {
      const units = await unitService.getUnits();
      res.render('unit/views/units', {
        title: 'Danh Mục Đơn Vị Tính',
        currentNav: 'master-units',
        units,
      });
    } catch (err) {
      next(err);
    }
  }

  // SSR Form Action: POST /master/units
  async createUnit(req: Request, res: Response, next: NextFunction) {
    try {
      await unitService.createUnit(req.body);
      res.redirect('/master/units');
    } catch (err) {
      next(err);
    }
  }
}

export const unitController = new UnitController();
