import { Request, Response, NextFunction } from 'express';

export const validateCreateReceipt = (req: Request, res: Response, next: NextFunction) => {
  const { receipt_no, created_by_id, details } = req.body;

  if (!receipt_no || typeof receipt_no !== 'string' || receipt_no.trim() === '') {
    return res.status(400).json({ success: false, message: 'Số phiếu nhập là bắt buộc.' });
  }

  if (!created_by_id) {
    return res.status(400).json({ success: false, message: 'Người lập phiếu là bắt buộc.' });
  }

  if (!Array.isArray(details) || details.length === 0) {
    return res.status(400).json({ success: false, message: 'Phiếu nhập phải có ít nhất 1 dòng chi tiết vật tư.' });
  }

  for (let i = 0; i < details.length; i++) {
    const item = details[i];
    if (!item.item_id || !item.unit_id) {
      return res.status(400).json({ success: false, message: `Dòng ${i + 1}: Vui lòng chọn Vật tư và Đơn vị tính.` });
    }
    if (isNaN(item.actual_quantity) || Number(item.actual_quantity) <= 0) {
      return res.status(400).json({ success: false, message: `Dòng ${i + 1}: Số lượng thực nhập phải lớn hơn 0.` });
    }
    if (isNaN(item.unit_price) || Number(item.unit_price) < 0) {
      return res.status(400).json({ success: false, message: `Dòng ${i + 1}: Đơn giá không được âm.` });
    }
  }

  next();
};
