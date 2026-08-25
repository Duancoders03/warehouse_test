import { Router } from 'express';
import unitRoutes from '../modules/unit/routes/unit.routes';
import warehouseRoutes from '../modules/warehouse/routes/warehouse.routes';
import supplierRoutes from '../modules/supplier/routes/supplier.routes';
import employeeRoutes from '../modules/employee/routes/employee.routes';
import itemRoutes from '../modules/item/routes/item.routes';
import receiptRoutes from '../modules/receipt/routes/receipt.routes';

import { receiptService } from '../modules/receipt/services/receipt.service';
import { itemService } from '../modules/item/services/item.service';
import { warehouseService } from '../modules/warehouse/services/warehouse.service';
import { supplierService } from '../modules/supplier/services/supplier.service';
import { env } from '../config/environment';

const router = Router();

// Root Dashboard Route
router.get('/', async (req, res, next) => {
  try {
    const receipts = await receiptService.getAllReceipts();
    const items = await itemService.getItems();
    const warehouses = await warehouseService.getWarehouses();
    const suppliers = await supplierService.getSuppliers();

    const totalAmount = receipts.reduce((acc, r) => acc + (r.total_amount || 0), 0);

    res.render('pages/dashboard', {
      title: 'Trang Chủ & Tổng Quan Kho',
      currentNav: 'dashboard',
      stats: {
        totalReceipts: receipts.length,
        totalAmount,
        itemsCount: items.length,
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

// Mount Module Routes
router.use(unitRoutes);
router.use(warehouseRoutes);
router.use(supplierRoutes);
router.use(employeeRoutes);
router.use(itemRoutes);
router.use(receiptRoutes);

export default router;
