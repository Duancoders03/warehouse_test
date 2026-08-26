import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const getDbName = (): string => {
  const envType = process.env.NODE_ENV;
  if (envType === 'test') {
    return process.env.DB_NAME_TEST || 'wms_db_test';
  }
  if (envType === 'production') {
    return process.env.DB_NAME_PROD || 'wms_db_prod';
  }
  return process.env.DB_NAME || 'wms_db';
};

export const env = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  COMPANY_NAME: process.env.COMPANY_NAME || 'Công Ty Cổ Phần Công Nghệ VIMES',

  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
  DB_NAME: getDbName(),
  DB_NAME_DEV: process.env.DB_NAME || 'wms_db',
  DB_NAME_TEST: process.env.DB_NAME_TEST || 'wms_db_test',
  DB_NAME_PROD: process.env.DB_NAME_PROD || 'wms_db_prod',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
};
