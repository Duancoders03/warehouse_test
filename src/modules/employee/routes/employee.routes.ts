import { Router } from 'express';
import { employeeController } from '../controllers/employee.controller';

const router = Router();

// SSR View Routes
router.get('/master/employees', (req, res, next) => employeeController.renderEmployeesPage(req, res, next));
router.post('/master/employees', (req, res, next) => employeeController.createEmployee(req, res, next));

export default router;
