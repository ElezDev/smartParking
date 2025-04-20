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
export interface RolePermissionsResponse {
  permissions: Record<string, string>; 
  role: {
    id: number;
    name: string;
  };
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

export const assignPermissionsToRole = async (role: number, permissionIds: number[]): Promise<AssignPermissionsResponse> => {
  const response = await api.post<AssignPermissionsResponse>(`/roles/${role}/permissionsassing`, { permissions: permissionIds });
  return response.data;
};

export const deleteRole = async (roleId: number): Promise<void> => {
  await api.delete(`/roles/${roleId}`);
}


  export const fetchRolePermissions = async (roleId: string): Promise<RolePermissionsResponse> => {
    const response = await axios.get(`/api/roles/${roleId}/permissionsAsignados`);
    return response.data;
  };
