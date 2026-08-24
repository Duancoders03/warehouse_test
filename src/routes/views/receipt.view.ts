import { Router } from 'express';
import { pageController } from '../../controllers/page.controller';

const router = Router();

router.get('/', (req, res, next) => pageController.renderDashboard(req, res, next));
router.get('/receipts', (req, res, next) => pageController.renderReceiptList(req, res, next));
router.get('/receipts/create', (req, res, next) => pageController.renderReceiptCreate(req, res, next));
router.get('/receipts/:id', (req, res, next) => pageController.renderReceiptDetail(req, res, next));

// Master Data Management pages
router.get('/master/items', (req, res, next) => pageController.renderMasterItems(req, res, next));
router.get('/master/warehouses', (req, res, next) => pageController.renderMasterWarehouses(req, res, next));
router.get('/master/suppliers', (req, res, next) => pageController.renderMasterSuppliers(req, res, next));
router.get('/master/units', (req, res, next) => pageController.renderMasterUnits(req, res, next));
router.get('/master/employees', (req, res, next) => pageController.renderMasterEmployees(req, res, next));

export default router;
