import { Supplier } from '../models/supplier.model';
import { SupplierDto, CreateSupplierDto } from '../dtos/supplier.dto';

export const MOCK_SUPPLIERS: SupplierDto[] = [
  { id: 's-1', code: 'NCC-HOAPAT', name: 'Tập đoàn Hòa Phát', address: 'KCN Phố Nối A, Hưng Yên', tax_code: '0100100101' },
  { id: 's-2', code: 'NCC-CADIVI', name: 'Công ty Cổ phần Dây cáp điện Việt Nam (CADIVI)', address: '70-72 Nam Kỳ Khởi Nghĩa, Q.1, TP.HCM', tax_code: '0300381564' },
  { id: 's-3', code: 'NCC-SCHNEIDER', name: 'Công ty TNHH Schneider Electric Việt Nam', address: 'Tầng 16, Ree Tower, Q.4, TP.HCM', tax_code: '0301423985' },
  { id: 's-4', code: 'NCC-RANGDONG', name: 'Công ty Cổ phần Bóng đèn Phích nước Rạng Đông', address: '87 Hạ Đình, Thanh Xuân, Hà Nội', tax_code: '0100101421' },
];

export class SupplierService {
  async getSuppliers(): Promise<SupplierDto[]> {
    try {
      const list = await Supplier.findAll({ order: [['code', 'ASC']] });
      if (list && list.length > 0) {
        return list.map(s => s.toJSON() as SupplierDto);
      }
    } catch {
      // Fallback
    }
    return MOCK_SUPPLIERS;
  }

  async getSupplierById(id: string): Promise<SupplierDto | null> {
    try {
      const supplier = await Supplier.findByPk(id);
      if (supplier) return supplier.toJSON() as SupplierDto;
    } catch {
      // Fallback
    }
    return MOCK_SUPPLIERS.find(s => s.id === id) || null;
  }

  async createSupplier(dto: CreateSupplierDto): Promise<SupplierDto> {
    const supplier = await Supplier.create({
      code: dto.code.toUpperCase().trim(),
      name: dto.name.trim(),
      address: dto.address?.trim(),
      tax_code: dto.tax_code?.trim(),
    });
    return supplier.toJSON() as SupplierDto;
  }
}

export const supplierService = new SupplierService();
