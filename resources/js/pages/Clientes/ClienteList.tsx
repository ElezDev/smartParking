import { useEffect, useState } from 'react';
import { ClienteService } from '@/services/clienteService';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import ClienteModal from './ClienteModal'; // Asegúrate de importar tu componente modal
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface ClienteListProps {
  refreshTrigger?: number;
}

export function ClienteList({ refreshTrigger }: ClienteListProps) {
  const [clientes, setClientes] = useState<{ id: number; nombre: string; email: string; telefono: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5; // Número de elementos por página

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        const response = await ClienteService.getAll();
        setClientes(response.data || response); // Dependiendo de cómo venga la respuesta
        setTotalPages(Math.ceil((response.data?.length || response.length) / itemsPerPage));
      } catch (error) {
        console.error('Error fetching clientes:', error);
        toast.error('Error al cargar los clientes');
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, [refreshTrigger]);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefono.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const paginatedClientes = filteredClientes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id: number) => {
    try {
      const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este cliente?');
      if (!confirmDelete) return;

      await ClienteService.delete(id);
      toast.success('Cliente eliminado correctamente');
      setClientes(clientes.filter(cliente => cliente.id !== id));
    } catch (error) {
      console.error('Error deleting cliente:', error);
      toast.error('Error al eliminar el cliente');
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      if (startPage > 1) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (endPage < totalPages) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Clientes</CardTitle>
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Buscar clientes..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Resetear a la primera página al buscar
              }}
            />
            {/* <ClienteModal onSuccess={() => setClientes([])}>
              <Button>Nuevo Cliente</Button>
            </ClienteModal> */}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedClientes.length > 0 ? (
                    paginatedClientes.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell className="font-medium">{cliente.id}</TableCell>
                        <TableCell>{cliente.nombre}</TableCell>
                        <TableCell>{cliente.email}</TableCell>
                        <TableCell>{cliente.telefono}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <ClienteModal cliente={cliente} onSuccess={() => setClientes([])}>
                            <Button variant="outline" size="sm">Editar</Button>
                          </ClienteModal>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(cliente.id)}
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        {searchTerm ? 'No se encontraron resultados' : 'No hay clientes registrados'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {filteredClientes.length > itemsPerPage && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(currentPage - 1)}
                          className={currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}
                        />
                      </PaginationItem>
                      
                      {renderPaginationItems()}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          className={currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}