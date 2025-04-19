import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ClienteModalProps = {
  cliente?: any;
  children: React.ReactNode;
  onSuccess?: () => void;
};

export default function ClienteModal({ cliente, children, onSuccess }: ClienteModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: cliente?.nombre || '',
    email: cliente?.email || '',
    telefono: cliente?.telefono || '',
    cc:cliente?.cc || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    try {
      let response;
      
      if (cliente) {
        response = await axios.put(`/api/clientes/${cliente.id}`, formData);
      } else {
        response = await axios.post('/api/clientes', formData);
      }

      const message = cliente ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente';
      toast.success(message);
      
      setOpen(false);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        cc: ''
      });
      
      // Ejecutar callback de éxito si existe
      onSuccess?.();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 422) {
          // Manejar errores de validación
          setErrors(error.response.data.errors || {});
        } else {
          // Mostrar error genérico
          toast.error(error.response.data.message || 'Ocurrió un error');
        }
      } else {
        toast.error('Ocurrió un error inesperado');
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]" disabledClose={true}>  
        <DialogHeader>
          <DialogTitle>
            {cliente ? 'Editar Cliente' : 'Crear Nuevo Cliente'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
          </div>
          <div>
            <Label htmlFor="cc">Identificacion</Label>
            <Input
              id="cc"
              value={formData.cc}
              onChange={handleChange}
            />
            {errors.cc && <p className="text-red-500 text-sm">{errors.cc}</p>}
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          
          <div>
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
            {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono}</p>}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}