import React, { useEffect, useState } from 'react';
import { TarifaService } from '@/services/tarifa.service';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon, SearchIcon, XIcon, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface TarifasListProps {
  onEdit: (id: number) => void;
  onSuccess: () => void;
}

const TarifasList: React.FC<TarifasListProps> = ({ onEdit, onSuccess }) => {
  const [tarifas, setTarifas] = useState<any[]>([]);
  const [filteredTarifas, setFilteredTarifas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tarifaToDelete, setTarifaToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTarifas();
  }, []);

  useEffect(() => {
    filterTarifas();
  }, [searchTerm, tarifas]);

  const fetchTarifas = async () => {
    try {
      setLoading(true);
      const data = await TarifaService.getAll();
      setTarifas(data);
    } catch (err) {
      setError('Error al cargar las tarifas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterTarifas = () => {
    if (!searchTerm) {
      setFilteredTarifas(tarifas);
      return;
    }

    const filtered = tarifas.filter(tarifa =>
      tarifa.tipo_vehiculo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTarifas(filtered);
  };

  const handleDeleteClick = (id: number) => {
    setTarifaToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tarifaToDelete) return;
    
    try {
      await TarifaService.delete(tarifaToDelete);
      setTarifas(tarifas.filter(tarifa => tarifa.id !== tarifaToDelete));
      toast.success('Tarifa eliminada correctamente');
      onSuccess();
    } catch (err) {
      toast.error('Error al eliminar la tarifa');
      console.error('Error al eliminar:', err);
    } finally {
      setDeleteDialogOpen(false);
      setTarifaToDelete(null);
    }
  };

  if (loading) return <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (error) return <div className="text-red-500 p-4 text-center">{error}</div>;

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Encabezado con título y barra de búsqueda alineada a la derecha */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold">Listado de Tarifas</h2>
          
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar tarifas..."
              className="pl-9 pr-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <XIcon 
                className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => setSearchTerm('')}
              />
            )}
          </div>
        </div>

        {/* Tabla de tarifas */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Tipo de Vehículo</TableHead>
                <TableHead>Valor Hora</TableHead>
                <TableHead>Valor Día</TableHead>
                <TableHead>Valor Minuto</TableHead>
                <TableHead>Valor Mes</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTarifas.map((tarifa) => (
                <TableRow key={tarifa.id}>
                  <TableCell className="font-medium">{tarifa.tipo_vehiculo}</TableCell>
                  <TableCell>${parseFloat(tarifa.valor_hora).toLocaleString()}</TableCell>
                  <TableCell>${parseFloat(tarifa.valor_dia).toLocaleString()}</TableCell>
                  <TableCell>${parseFloat(tarifa.valor_minuto).toLocaleString()}</TableCell>
                  <TableCell>${parseFloat(tarifa.valor_mes).toLocaleString()}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(tarifa.id)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(tarifa.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredTarifas.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              {searchTerm ? 'No se encontraron tarifas' : 'No hay tarifas registradas'}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la tarifa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
            onClick={handleDeleteConfirm}
            className="bg-red-600 text-white hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TarifasList;