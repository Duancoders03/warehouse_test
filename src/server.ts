import app from './app';
import { env } from './config/environment';
import { connectDatabase } from './config/database';

const startServer = async () => {
  // Gracefully attempt DB connection (switches to mock mode if DB is not set up yet)
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
