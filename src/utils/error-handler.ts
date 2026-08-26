import { ValidationError } from 'sequelize';

// Hàm xử lý thông báo lỗi dữ liệu Sequelize cho giao diện SSR
export const handleSequelizeValidationError = (error: any): void => {
  if (error instanceof ValidationError && error.errors?.[0]?.message) {
    throw new Error(error.errors[0].message);
  }
};
