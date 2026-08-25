export interface UserDto {
  id: string;
  code: string;
  full_name: string;
  department?: string;
  role: 'CREATOR' | 'KEEPER' | 'ACCOUNTANT';
}

export type CreateUserDto = Omit<UserDto, 'id'>;
export type UpdateUserDto = Partial<CreateUserDto>;
