import { Router } from 'express';
import unitRoutes from '../modules/unit/routes/unit.routes';
import warehouseRoutes from '../modules/warehouse/routes/warehouse.routes';
import supplierRoutes from '../modules/supplier/routes/supplier.routes';
import userRoutes from '../modules/user/routes/user.routes';
import itemRoutes from '../modules/item/routes/item.routes';
import receiptRoutes from '../modules/receipt/routes/receipt.routes';

import { receiptService } from '../modules/receipt/services/receipt.service';
import { itemService } from '../modules/item/services/item.service';
import { warehouseService } from '../modules/warehouse/services/warehouse.service';
import { supplierService } from '../modules/supplier/services/supplier.service';
import { env } from '../config/environment';

const router = Router();

// Route Trang Chủ / Tổng Quan (Dashboard)
router.get('/', async (req, res, next) => {
  try {
    const receiptData = await receiptService.getAllReceipts({ limit: 100 });
    const receipts = receiptData.items;
    const items = await itemService.getItems();
    const warehouses = await warehouseService.getWarehouses();
    const suppliers = await supplierService.getSuppliers();

    const totalAmount = receipts.reduce((acc: number, r: any) => acc + (r.total_amount || 0), 0);

    res.render('pages/dashboard', {
      title: 'Trang Chủ & Tổng Quan Kho',
      currentNav: 'dashboard',
      stats: {
        totalReceipts: receiptData.totalItems,
        totalAmount,
        itemsCount: items.totalItems,
        warehousesCount: warehouses.length,
        suppliersCount: suppliers.totalItems,
      },
      recentReceipts: receipts.slice(0, 5),
      companyName: env.COMPANY_NAME,
    });
  } catch (err) {
    next(err);
  }
});

// Tích hợp (Mount) các Route Module
router.use(unitRoutes);
router.use(warehouseRoutes);
router.use(supplierRoutes);
router.use(userRoutes);
router.use(itemRoutes);
router.use(receiptRoutes);

export default router;
