import { Request, Response } from 'express';
import { masterDataService } from '../services/master-data.service';

export class MasterDataController {
  async getUnits(req: Request, res: Response) {
    const units = await masterDataService.getUnits();
    res.json({ success: true, data: units });
  }

  async getWarehouses(req: Request, res: Response) {
    const warehouses = await masterDataService.getWarehouses();
    res.json({ success: true, data: warehouses });
  }

  async getSuppliers(req: Request, res: Response) {
    const suppliers = await masterDataService.getSuppliers();
    res.json({ success: true, data: suppliers });
  }

  async getEmployees(req: Request, res: Response) {
    const { role } = req.query;
    const employees = await masterDataService.getEmployees(role as string);
    res.json({ success: true, data: employees });
  }

  async getItems(req: Request, res: Response) {
    const items = await masterDataService.getItems();
    res.json({ success: true, data: items });
  }
}

export const masterDataController = new MasterDataController();
