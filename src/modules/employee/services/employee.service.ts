import { Employee } from '../models/employee.model';
import { EmployeeDto, CreateEmployeeDto } from '../dtos/employee.dto';

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

export class EmployeeService {
  async getEmployees(role?: string): Promise<EmployeeDto[]> {
    try {
      const whereClause = role ? { role } : {};
      const list = await Employee.findAll({ where: whereClause, order: [['code', 'ASC']] });
      if (list && list.length > 0) {
        return list.map(e => e.toJSON() as EmployeeDto);
      }
    } catch {
      // Fallback
    }
    if (role) {
      return MOCK_EMPLOYEES.filter(e => e.role === role);
    }
    return MOCK_EMPLOYEES;
  }

  async getEmployeeById(id: string): Promise<EmployeeDto | null> {
    try {
      const emp = await Employee.findByPk(id);
      if (emp) return emp.toJSON() as EmployeeDto;
    } catch {
      // Fallback
    }
    return MOCK_EMPLOYEES.find(e => e.id === id) || null;
  }

  async createEmployee(dto: CreateEmployeeDto): Promise<EmployeeDto> {
    const emp = await Employee.create({
      code: dto.code.toUpperCase().trim(),
      full_name: dto.full_name.trim(),
      department: dto.department?.trim(),
      role: dto.role,
      warehouse_id: dto.warehouse_id,
    });
    return emp.toJSON() as EmployeeDto;
  }
}

export const employeeService = new EmployeeService();
