export interface EmployeeDto {
  id: string;
  code: string;
  full_name: string;
  department?: string;
  role: 'CREATOR' | 'KEEPER' | 'ACCOUNTANT';
  warehouse_id?: string;
}

export interface CreateEmployeeDto {
  code: string;
  full_name: string;
  department?: string;
  role: 'CREATOR' | 'KEEPER' | 'ACCOUNTANT';
  warehouse_id?: string;
}
