import { Request, Response, NextFunction } from 'express';
import { unitService } from '../services/unit.service';

export class UnitController {
  // Render trang giao diện danh sách: GET /admin/units
  async renderUnitsPage(req: Request, res: Response, next: NextFunction) {
    try {
      const keyword = (req.query.keyword as string) || '';
      const units = await unitService.getUnits(keyword);
      const successMsg = req.query.success as string;
      const errorMsg = req.query.error as string;

      res.render('unit/views/units', {
        title: 'Danh Mục Đơn Vị Tính',
        currentNav: 'admin-units',
        units,
        keyword,
        successMsg,
        errorMsg,
      });
    } catch (err) {
      next(err);
    }
  }

  // Xử lý gửi Form: POST /admin/units (Tạo mới)
  async createUnit(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, name } = req.body;
      await unitService.createUnit({ code, name });
      res.redirect('/admin/units?success=' + encodeURIComponent('Thêm mới đơn vị tính thành công!'));
    } catch (err: any) {
      res.redirect('/admin/units?error=' + encodeURIComponent(err.message || 'Lỗi khi thêm mới đơn vị tính'));
    }
  }

  // Xử lý gửi Form: POST /admin/units/:id/update (Cập nhật)
  async updateUnit(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { code, name } = req.body;
      await unitService.updateUnit(id, { code, name });
      res.redirect('/admin/units?success=' + encodeURIComponent('Cập nhật đơn vị tính thành công!'));
    } catch (err: any) {
      res.redirect('/admin/units?error=' + encodeURIComponent(err.message || 'Lỗi khi cập nhật đơn vị tính'));
    }
  }

  // Xử lý gửi Form: POST /admin/units/:id/delete (Xóa)
  async deleteUnit(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await unitService.deleteUnit(id);
      res.redirect('/admin/units?success=' + encodeURIComponent('Xóa đơn vị tính thành công!'));
    } catch (err: any) {
      res.redirect('/admin/units?error=' + encodeURIComponent(err.message || 'Lỗi khi xóa đơn vị tính'));
    }
  }
}

export const unitController = new UnitController();
