import { Sequelize } from 'sequelize';
import { env } from './environment';

export const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: 'postgres',
  logging: env.NODE_ENV === 'development' ? false : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export const connectDatabase = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối Cơ sở dữ liệu PostgreSQL thành công!');
    return true;
  } catch (error) {
    console.log('⚠️ Chưa kết nối Cơ sở dữ liệu (Đang sử dụng Mock Data Mode cho UI)');
    return false;
  }
};
