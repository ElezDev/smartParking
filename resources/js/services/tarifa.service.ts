import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export const TarifaService = {
    async getAll() {
        try {
            const response = await api.get('/tarifas');
            return response.data;
        } catch (error) {
            toast.error('Error al cargar las tarifas');
            throw error;
        }
    },

    async getById(id: number) {
        try {
            const response = await api.get(`/tarifas/${id}`);
            return response.data;
        } catch (error) {
            toast.error('Error al obtener la tarifa');
            throw error;
        }
    },

    async create(data: any) {
        try {
            const response = await api.post('/tarifas', data);
            toast.success('Tarifa creada exitosamente');
            return response.data;
        } catch (error) {
            toast.error('Error al crear la tarifa');
            throw error;
        }
    },

    async update(id: number, data: any) {
        try {
            const response = await api.put(`/tarifas/${id}`, data);
            toast.success('Tarifa actualizada exitosamente');
            return response.data;
        } catch (error) {
            toast.error('Error al actualizar la tarifa');
            throw error;
        }
    },

    async delete(id: number) {
        try {
            await api.delete(`/tarifas/${id}`);
            toast.success('Tarifa eliminada exitosamente');
        } catch (error) {
            toast.error('Error al eliminar la tarifa');
            throw error;
        }
    },
};