import { useState, useEffect } from 'react';
import { 
  fetchPermissions,
  fetchRolePermissions,
  assignPermissionsToRole,
  type Permission 
} from '@/services/rolesService';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
  const [assignedPermissions, setAssignedPermissions] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar todos los permisos y los asignados al rol
  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const [permissions, rolePerms] = await Promise.all([
          fetchPermissions(),
          fetchRolePermissions(roleId),
        ]);
        
        setAllPermissions(permissions);
        setAssignedPermissions(rolePerms.map(p => p.id));
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
    setAssignedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSavePermissions = async () => {
    setIsSubmitting(true);
    try {
      await assignPermissionsToRole(Number(roleId), assignedPermissions);
      toast.success('Permisos actualizados correctamente');
      onSuccess?.();
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error('Error al actualizar permisos');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  // Agrupar permisos por categoría si tienen prefijo común (ej: "user.create", "user.delete")
  const groupedPermissions = allPermissions.reduce((acc, permission) => {
    const [category] = permission.name.split('.');
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {roleName ? `Permisos para: ${roleName}` : 'Asignar permisos'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(groupedPermissions).map(([category, perms]) => (
            <div key={category} className="space-y-3">
              <h3 className="font-medium capitalize">{category}</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {perms.map(permission => (
                  <div key={permission.id} className="flex items-center space-x-3">
                    <Switch
                      id={`perm-${permission.id}`}
                      checked={assignedPermissions.includes(permission.id)}
                      onCheckedChange={() => handleTogglePermission(permission.id)}
                    />
                    <Label htmlFor={`perm-${permission.id}`} className="flex flex-col">
                      <span className="font-medium">
                        {permission.name.split('.')[1] || permission.name}
                      </span>
                      {permission.description && (
                        <span className="text-xs text-muted-foreground">
                          {permission.description}
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => onSuccess?.()}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSavePermissions} 
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}