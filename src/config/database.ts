import { Sequelize } from 'sequelize';
import { env } from './environment';

export const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: 'postgres',
  logging: false,
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
    console.log(`✅ Kết nối Cơ sở dữ liệu PostgreSQL (${env.DB_NAME}) thành công!`);
    return true;
  } catch (error) {
    console.log('⚠️ Chưa kết nối Cơ sở dữ liệu (Đang sử dụng Mock Data Mode cho UI)');
    return false;
  }
};

// Configuration export for Sequelize CLI (Migrations & Seeders)
module.exports = {
  development: {
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME_DEV,
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'postgres'
  },
  test: {
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME_TEST,
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'postgres'
  },
  production: {
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME_PROD,
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'postgres'
  },
  sequelize,
  connectDatabase,
};
