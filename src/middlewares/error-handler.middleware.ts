import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error stack:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Lỗi Hệ Thống Nội Bộ';

  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? err : undefined,
    });
  }

  res.status(statusCode).render('pages/404', {
    title: 'Đã xảy ra lỗi',
    message,
    statusCode,
  });
};
