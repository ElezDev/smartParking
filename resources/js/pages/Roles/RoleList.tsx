import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { fetchRoles, deleteRole } from '@/services/rolesService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, KeyRound } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
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

interface Role {
  id: number;
  name: string;
}

interface RoleListProps {
  onRoleSelect: (id: number) => void;
  onRoleDeleted?: () => void;
}

export function RoleList({ onRoleSelect, onRoleDeleted }: RoleListProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null);

  const loadRoles = async () => {
    try {
      setIsLoading(true);
      const rolesData = await fetchRoles();
      setRoles(rolesData);
    } catch (error) {
      toast.error("Error al cargar los roles");
      console.error("Error loading roles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleDeleteClick = (id: number) => {
    setRoleToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;
    
    setDeletingId(roleToDelete);
    setOpenDeleteDialog(false);
    
    try {
      await deleteRole(roleToDelete);
      toast.success("Rol eliminado correctamente");
      await loadRoles();
      if (onRoleDeleted) onRoleDeleted();
    } catch (error) {
      toast.error("Error al eliminar el rol");
      console.error("Error deleting role:", error);
    } finally {
      setDeletingId(null);
      setRoleToDelete(null);
    }
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Lista de Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60%]">Nombre del Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-24" />
                    </TableCell>
                  </TableRow>
                ))
              ) : roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center h-24">
                    No hay roles disponibles
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRoleSelect(role.id)}
                        className="gap-1"
                      >
                        <KeyRound className="h-4 w-4" />
                        Permisos
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(role.id)}
                        disabled={deletingId === role.id}
                        className="gap-1"
                      >
                        {deletingId === role.id ? (
                          "Eliminando..."
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            Eliminar
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción es irreversible. ¿Estás seguro que deseas eliminar este rol?
              Los usuarios con este rol perderán sus permisos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
            onClick={handleConfirmDelete}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {deletingId ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>

          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}