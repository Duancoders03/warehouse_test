import { Request, Response, NextFunction } from 'express';
import { employeeService } from '../services/employee.service';
import { warehouseService } from '../../warehouse/services/warehouse.service';

export class EmployeeController {
  // SSR View Render: GET /master/employees
  async renderEmployeesPage(req: Request, res: Response, next: NextFunction) {
    try {
      const employees = await employeeService.getEmployees();
      const warehouses = await warehouseService.getWarehouses();
      res.render('employee/views/employees', {
        title: 'Danh Mục Nhân Viên / Vai Trò',
        currentNav: 'master-employees',
        employees,
        warehouses,
      });
    } catch (err) {
      next(err);
    }
  }

  // SSR Form Action: POST /master/employees
  async createEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      await employeeService.createEmployee(req.body);
      res.redirect('/master/employees');
    } catch (err) {
      next(err);
    }
  }
}

export const employeeController = new EmployeeController();
