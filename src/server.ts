import app from './app';
import { env } from './config/environment';
import { connectDatabase } from './config/database';

const startServer = async () => {
  // Thử kết nối Cơ sở dữ liệu (chuyển sang chế độ giả lập nếu chưa thiết lập CSDL)
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 VIMES Warehouse Management System (WMS) Ready!`);
    console.log(`🌐 Application URL: http://localhost:${env.PORT}`);
    console.log(`📄 Form Mẫu 01-VT: http://localhost:${env.PORT}/receipts/create`);
    console.log(`=======================================================`);
  });
};

startServer();
