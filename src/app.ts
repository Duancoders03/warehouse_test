import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/error-handler.middleware';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Configure View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Custom Layout Engine Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const originalRender = res.render;
  res.render = function (view: string, options?: any, callback?: any) {
    const opts = options || {};
    
    // Skip layout for layout files themselves
    if (view.startsWith('layouts/')) {
      return originalRender.call(this, view, opts, callback);
    }

    originalRender.call(this, view, opts, (err: Error | null, html: string) => {
      if (err) {
        return next(err);
      }
      opts.body = html;
      return originalRender.call(this, 'layouts/main', opts, callback);
    });
  } as any;
  next();
});

// Register Routes
app.use('/', routes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).render('pages/404', {
    title: '404 - Không Tìm Thấy Trang',
    message: `Đường dẫn "${req.originalUrl}" không tồn tại trên hệ thống.`,
  });
});

// Centralized Error Handler Middleware
app.use(errorHandler);

export default app;
