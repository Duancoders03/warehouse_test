import { Router } from 'express';
import { receiptController } from '../../controllers/receipt.controller';
import { validateCreateReceipt } from '../../middlewares/validate.middleware';

const router = Router();

router.get('/', (req, res, next) => receiptController.getReceiptsApi(req, res, next));
router.get('/:id', (req, res, next) => receiptController.getReceiptByIdApi(req, res, next));
router.post('/', validateCreateReceipt, (req, res, next) => receiptController.createReceiptApi(req, res, next));
router.delete('/:id', (req, res, next) => receiptController.deleteReceiptApi(req, res, next));

export default router;
