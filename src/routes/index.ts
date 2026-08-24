import { Router } from 'express';
import receiptApi from './api/receipt.api';
import masterDataApi from './api/master-data.api';
import viewRoutes from './views/receipt.view';

const router = Router();

// API Routes
router.use('/api/receipts', receiptApi);
router.use('/api/master-data', masterDataApi);

// View Routes
router.use('/', viewRoutes);

export default router;
