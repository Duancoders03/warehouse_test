import { UnitDto, WarehouseDto, SupplierDto, EmployeeDto, ItemDto } from '../dtos/receipt.dto';

// Initial Seed / Mock Data for UI demonstration
export const MOCK_UNITS: UnitDto[] = [
  { id: 'u-1', code: 'KG', name: 'Kilôgam' },
  { id: 'u-2', code: 'CAI', name: 'Cái' },
  { id: 'u-3', code: 'MET', name: 'Mét' },
  { id: 'u-4', code: 'THUNG', name: 'Thùng' },
  { id: 'u-5', code: 'BO', name: 'Bộ' },
  { id: 'u-6', code: 'CUON', name: 'Cuộn' },
  { id: 'u-7', code: 'TAN', name: 'Tấn' },
  { id: 'u-8', code: 'HOP', name: 'Hộp' },
];

export const MOCK_WAREHOUSES: WarehouseDto[] = [
  { id: 'w-1', code: 'KHO-TONG', name: 'Kho Tổng Trung Tâm VIMES', address: 'Khu công nghiệp Tân Bình, TP.HCM' },
  { id: 'w-2', code: 'KHO-VT1', name: 'Kho Vật Tư 01 - Cầu Giấy', address: 'Quận Cầu Giấy, Hà Nội' },
  { id: 'w-3', code: 'KHO-TP', name: 'Kho Thành Phẩm Dĩ An', address: 'TX Dĩ An, Bình Dương' },
];

export const MOCK_SUPPLIERS: SupplierDto[] = [
  { id: 's-1', code: 'NCC-HOAPAT', name: 'Tập đoàn Hòa Phát', address: 'KCN Phố Nối A, Hưng Yên', tax_code: '0100100101' },
  { id: 's-2', code: 'NCC-CADIVI', name: 'Công ty Cổ phần Dây cáp điện Việt Nam (CADIVI)', address: '70-72 Nam Kỳ Khởi Nghĩa, Q.1, TP.HCM', tax_code: '0300381564' },
  { id: 's-3', code: 'NCC-SCHNEIDER', name: 'Công ty TNHH Schneider Electric Việt Nam', address: 'Tầng 16, Ree Tower, Q.4, TP.HCM', tax_code: '0301423985' },
  { id: 's-4', code: 'NCC-RANGDONG', name: 'Công ty Cổ phần Bóng đèn Phích nước Rạng Đông', address: '87 Hạ Đình, Thanh Xuân, Hà Nội', tax_code: '0100101421' },
];

export const MOCK_EMPLOYEES: EmployeeDto[] = [
  // Kho Tổng Trung Tâm VIMES (w-1)
  { id: 'e-1', code: 'NV-001', full_name: 'Nguyễn Văn Thanh', department: 'Bộ Phận Nhập Kho (Kho Tổng)', role: 'CREATOR', warehouse_id: 'w-1' },
  { id: 'e-8', code: 'NV-008', full_name: 'Đặng Văn Nam', department: 'Phòng Vật Tư (Kho Tổng)', role: 'CREATOR', warehouse_id: 'w-1' },
  { id: 'e-3', code: 'NV-003', full_name: 'Lê Hoàng Minh', department: 'Bộ Phận Quản Lý Kho Tổng', role: 'KEEPER', warehouse_id: 'w-1' },

  // Kho Vật Tư 01 - Cầu Giấy (w-2)
  { id: 'e-4', code: 'NV-004', full_name: 'Phạm Đức Long', department: 'Bộ Phận Vật Tư (Kho VT 01)', role: 'CREATOR', warehouse_id: 'w-2' },
  { id: 'e-9', code: 'NV-009', full_name: 'Đỗ Thị Hương', department: 'Phòng Nhập Kho (Kho VT 01)', role: 'CREATOR', warehouse_id: 'w-2' },
  { id: 'e-6', code: 'NV-006', full_name: 'Phạm Văn Hùng', department: 'Bộ Phận Quản Lý Kho VT 01', role: 'KEEPER', warehouse_id: 'w-2' },

  // Kho Thành Phẩm Dĩ An (w-3)
  { id: 'e-5', code: 'NV-005', full_name: 'Hoàng Thị Thu', department: 'Bộ Phận Thành Phẩm (Kho TP Dĩ An)', role: 'CREATOR', warehouse_id: 'w-3' },
  { id: 'e-10', code: 'NV-010', full_name: 'Nông Văn Thái', department: 'Phòng Kế Hoạch (Kho TP Dĩ An)', role: 'CREATOR', warehouse_id: 'w-3' },
  { id: 'e-7', code: 'NV-007', full_name: 'Vũ Thị Hồng', department: 'Bộ Phận Quản Lý Kho TP Dĩ An', role: 'KEEPER', warehouse_id: 'w-3' },

  // Kế toán trưởng duy nhất (Toàn công ty)
  { id: 'e-2', code: 'NV-002', full_name: 'Trần Thị Mai', department: 'Phòng Kế Toán Toàn Công Ty', role: 'ACCOUNTANT' },
];

export const MOCK_ITEMS: ItemDto[] = [
  { id: 'i-1', code: 'VT-THEP-01', name: 'Thép phi 12 Hòa Phát', specifications: 'Thép cuộn CB300-V, Ø12mm, chuẩn ISO 9001', unit_id: 'u-1', unit: MOCK_UNITS[0] },
  { id: 'i-2', code: 'VT-CAP-02', name: 'Cáp điện Cadivi 2x2.5mm', specifications: 'Cáp đồng bọc nhựa PVC 450/750V', unit_id: 'u-3', unit: MOCK_UNITS[2] },
  { id: 'i-3', code: 'VT-APT-03', name: 'Aptomat 3 Pha 63A Schneider', specifications: 'MCCB EasyPact EZC100N3063, 3P 63A 18kA', unit_id: 'u-2', unit: MOCK_UNITS[1] },
  { id: 'i-4', code: 'VT-DEN-04', name: 'Đèn LED Panel Rạng Đông 60x60', specifications: 'Công suất 40W, ánh sáng trắng 6500K', unit_id: 'u-2', unit: MOCK_UNITS[1] },
  { id: 'i-5', code: 'VT-BANG-05', name: 'Băng keo cách điện 3M', specifications: 'Cuộn 18mm x 10m chịu nhiệt 80°C', unit_id: 'u-6', unit: MOCK_UNITS[5] },
];

class MasterDataService {
  async getUnits(): Promise<UnitDto[]> {
    return MOCK_UNITS;
  }

  async getWarehouses(): Promise<WarehouseDto[]> {
    return MOCK_WAREHOUSES;
  }

  async getSuppliers(): Promise<SupplierDto[]> {
    return MOCK_SUPPLIERS;
  }

  async getEmployees(role?: string): Promise<EmployeeDto[]> {
    if (role) {
      return MOCK_EMPLOYEES.filter(e => e.role === role);
    }
    return MOCK_EMPLOYEES;
  }

  async getItems(): Promise<ItemDto[]> {
    return MOCK_ITEMS;
  }
}

export const masterDataService = new MasterDataService();
