export interface User {
    id: string;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
    roles: Role[];
  }
  
  export interface CreateUserData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role_ids: number[];
  }
  
  export interface UpdateUserData extends Omit<CreateUserData, 'password' | 'password_confirmation'> {
    password?: string;
    password_confirmation?: string;
  }
  
  export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    permissions?: Permissions[];
  }
  export interface Tarifa {
    id: number;
    tipo_vehiculo: string;
    valor_hora: string;
    valor_dia: string;
    valor_minuto: string;
    valor_mes: string;
    created_at: string | null;
    updated_at: string | null;
  }