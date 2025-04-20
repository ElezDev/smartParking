// src/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export interface RoleData {
    name: string;
    description?: string;
}

export interface RoleResponse {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Permission {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AssignPermissionsResponse {
    success: boolean;
    message: string;
}

export const fetchRoles = async (): Promise<RoleResponse[]> => {
  const response = await api.get<RoleResponse[]>('/roles');
  return response.data;
};

export const createRole = async (roleData: RoleData): Promise<RoleResponse> => {
    const response = await api.post<RoleResponse>('/roles', roleData);
    return response.data;
};

export const fetchPermissions = async (): Promise<Permission[]> => {
  const response = await api.get<Permission[]>('/permissions');
  return response.data;
};

export const assignPermissionsToRole = async (roleId: number, permissionIds: number[]): Promise<AssignPermissionsResponse> => {
  const response = await api.post<AssignPermissionsResponse>(`/roles/${roleId}/permissions`, { permissions: permissionIds });
  return response.data;
};

export const deleteRole = async (roleId: number): Promise<void> => {
  await api.delete(`/roles/${roleId}`);
}

export const fetchRolePermissions = async (roleId: string): Promise<Permission[]> => {
  try {
    const response = await api.get(`/roles/${roleId}/permissions`);
    return response.data.permissions || [];
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    throw error;
  }
};