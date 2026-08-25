import { ValidationError } from 'sequelize';

// Fuction handle msg errors for SSR
export const handleSequelizeValidationError = (error: any): void => {
  if (error instanceof ValidationError && error.errors?.[0]?.message) {
    throw new Error(error.errors[0].message);
  }
};
