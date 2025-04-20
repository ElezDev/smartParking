// src/services/userService.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});



export const userService = {
  async fetchUsers(): Promise<User[]> {
    const response = await api.get('/usuarios');
    return response.data;
  },

  async fetchUser(id: string): Promise<User> {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  async createUser(userData: CreateUserData): Promise<User> {
    const response = await api.post('/usuarios', userData);
    return response.data;
  },

  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/usuarios/${id}`);
  },

  // Gestión de Roles
  async fetchRoles(): Promise<Role[]> {
    const response = await api.get('/roles');
    return response.data;
  },

  async assignRole(userId: string, roleName: string): Promise<User> {
    const response = await api.post(`/usuarios/${userId}/asignar-rol`, { role: roleName });
    return response.data;
  },

  async getUserRoles(userId: string): Promise<string[]> {
    const response = await api.get(`/usuarios/${userId}/roles`);
    return response.data.roles;
  },
};

// Tipos recomendados para tu archivo types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  roles?: string[];
  status?: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserData extends Partial<CreateUserData> {
  status?: 'active' | 'inactive';
}

export interface Role {
  id: string;
  name: string;
  guard_name: string;
  created_at?: string;
  updated_at?: string;
}