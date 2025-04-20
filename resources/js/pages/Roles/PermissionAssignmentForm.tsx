import { useState, useEffect } from 'react';
import { 
  fetchPermissions,
  fetchRolePermissions,
  assignPermissionsToRole,
  type Permission,
  type RolePermissionsResponse
} from '@/services/rolesService';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Check, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PermissionAssignmentFormProps {
  roleId: string;
  roleName?: string;
  onSuccess?: () => void;
}

export default function PermissionAssignmentForm({
  roleId,
  roleName,
  onSuccess,
}: PermissionAssignmentFormProps) {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [assignedPermissions, setAssignedPermissions] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        setIsLoading(true);
        const [permissions, rolePermissionsResponse] = await Promise.all([
          fetchPermissions(),
          fetchRolePermissions(roleId),
        ]);

        setAllPermissions(permissions);
        
        const assignedPerms: Record<number, boolean> = {};
        Object.keys(rolePermissionsResponse.permissions).forEach(key => {
          assignedPerms[Number(key)] = true;
        });
        
        setAssignedPermissions(assignedPerms);
      } catch (error) {
        console.error('Error loading permissions:', error);
        toast.error('No se pudieron cargar los permisos');
      } finally {
        setIsLoading(false);
      }
    };

    loadPermissions();
  }, [roleId]);

  const handleTogglePermission = (permissionId: number) => {
    setAssignedPermissions(prev => ({
      ...prev,
      [permissionId]: !prev[permissionId]
    }));
  };

 // Modifica la función handleSavePermissions
const handleSavePermissions = async () => {
  setIsSubmitting(true);
  try {
    const selectedPermissionIds = Object.entries(assignedPermissions)
      .filter(([_, isAssigned]) => isAssigned)
      .map(([id]) => Number(id));

    await assignPermissionsToRole(Number(roleId), selectedPermissionIds);
    
    toast.success('Permisos actualizados correctamente');
    if (onSuccess) {
      onSuccess(); 
    }
  } catch (error) {
    console.error('Error updating permissions:', error);
    toast.error('Error al actualizar permisos');
  } finally {
    setIsSubmitting(false);
  }
};

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Cargando permisos...</p>
      </div>
    );
  }

  const selectedCount = Object.values(assignedPermissions).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              {roleName ? `Permisos para: ${roleName}` : 'Asignar permisos'}
            </CardTitle>
            <Badge variant="outline">
              {selectedCount} de {allPermissions.length} seleccionados
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="divide-y rounded-lg border">
            {allPermissions.map(permission => (
              <div 
                key={permission.id} 
                className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Switch
                    id={`perm-${permission.id}`}
                    checked={!!assignedPermissions[permission.id]}
                    onCheckedChange={() => handleTogglePermission(permission.id)}
                    className="data-[state=checked]:bg-primary"
                  />
                  <Label htmlFor={`perm-${permission.id}`} className="flex flex-col space-y-1 cursor-pointer">
                    <span className="font-medium flex items-center">
                      {permission.name}
                      {assignedPermissions[permission.id] && (
                        <Check className="ml-2 h-4 w-4 text-primary" />
                      )}
                    </span>
                    {permission.description && (
                      <span className="text-sm text-muted-foreground">
                        {permission.description}
                      </span>
                    )}
                  </Label>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button 
          variant="outline" 
          onClick={() => onSuccess?.()}
          className="gap-2"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSavePermissions} 
          disabled={isSubmitting}
          className="gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}