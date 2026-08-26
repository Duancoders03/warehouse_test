import { Router } from 'express';
import { receiptController } from '../controllers/receipt.controller';

const router = Router();

// SSR View Routes & Form Actions (Receipt Header & Aggregate)
router.get('/receipts', (req, res, next) => receiptController.renderReceiptList(req, res, next));
router.get('/receipts/create', (req, res, next) => receiptController.renderReceiptCreate(req, res, next));
router.post('/receipts/create', (req, res, next) => receiptController.handleCreateReceipt(req, res, next));
router.get('/receipts/:id/edit', (req, res, next) => receiptController.renderReceiptEdit(req, res, next));
router.post('/receipts/:id/edit', (req, res, next) => receiptController.handleUpdateReceipt(req, res, next));
router.get('/receipts/:id', (req, res, next) => receiptController.renderReceiptDetail(req, res, next));
router.post('/receipts/:id/status', (req, res, next) => receiptController.handleUpdateStatus(req, res, next));
router.post('/receipts/:id/delete', (req, res, next) => receiptController.handleDeleteReceipt(req, res, next));

export default router;
