import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export const ClienteService = {
    async getAll() {
        const response = await api.get('/clientes');
        return response.data;
    },
    
    async create(clienteData: any) {
        const response = await api.post('/clientes', clienteData);
        return response.data;
    },
    
    async update(id: number, clienteData: any) {
        const response = await api.put(`/clientes/${id}`, clienteData);
        return response.data;
    },
    
    async delete(id: number) {
        const response = await api.delete(`/clientes/${id}`);
        return response.data;
    }
};