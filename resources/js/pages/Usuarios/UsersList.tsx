// components/user-list.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { userService } from "@/services/usersService";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import { UserModal } from "./UsuarioModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  roles?: string[];
  status?: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.fetchUsers();
      const formattedData = data.map((user: any) => ({
        ...user,
        email_verified_at: user.email_verified_at || null,
      }));
      setUsers(formattedData);
    } catch (err) {
      setError("Error al cargar los usuarios");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await userService.deleteUser(userToDelete.toString());
      setUsers(users.filter(user => user.id !== userToDelete));
      toast.success("Usuario eliminado correctamente");
    } catch (err) {
      toast.error("Error al eliminar el usuario");
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const openDeleteDialog = (userId: number) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-3 w-[200px]" />
              </div>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-9 w-16 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-32 gap-2">
        <Icons.alertCircle className="h-8 w-8 text-red-500" />
        <p className="text-red-500 font-medium">{error}</p>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => window.location.reload()}
          className="mt-2"
        >
          <Icons.refresh className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-32 gap-2">
        <Icons.users className="h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground font-medium">No hay usuarios registrados</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.location.reload()}
          className="mt-2"
        >
          <Icons.refresh className="mr-2 h-4 w-4" />
          Recargar
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {users.map((user) => (
          <Card 
            key={user.id} 
            className="hover:shadow-lg transition-shadow duration-200 group relative"
          >
            {/* Indicador de estado */}
            <div className={`absolute top-2 right-2 h-3 w-3 rounded-full 
              ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}
            />
            
            <CardHeader className="flex flex-row items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-12 w-12 border-2 border-white group-hover:border-primary transition-colors">
                      <AvatarImage 
                        src={user.avatar || "/default-avatar.png"} 
                        alt={user.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-muted">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
              
              <div className="space-y-1 overflow-hidden">
                <CardTitle className="text-lg truncate" title={user.name}>
                  {user.name}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <p className="text-sm text-muted-foreground truncate" title={user.email}>
                    {user.email}
                  </p>
                  {user.email_verified_at && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <Icons.verified className="h-4 w-4 text-blue-500" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Email verificado</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                {user.roles?.map(role => (
                  <Badge 
                    key={role} 
                    variant={role === "admin" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {role.toLowerCase()}
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <UserModal 
                  userToEdit={{
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.roles?.[0] || ''
                  }}
                  onSuccess={loadUsers}
                >
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Icons.edit className="h-4 w-4" />
                    <span className="sr-only">Editar usuario</span>
                  </Button>
                </UserModal>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => openDeleteDialog(user.id)}
                >
                  <Icons.trash className="h-4 w-4" />
                  <span className="sr-only">Eliminar usuario</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El usuario será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}