import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import { Button } from '@/components/ui/button';
import { RoleModal } from './RoleModal';
import { RoleList } from './RoleList';
import { RolePermissionModal } from './RolePermissionModal';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Roles',
    href: '/roles',
  },
];

export default function RolesPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [isRolePermissionModalOpen, setRolePermissionModalOpen] = useState(false);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setRolePermissionModalOpen(false);  // Cerrar el modal después de guardar
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestión de Roles" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestión de Roles</h1>
          <RoleModal onSuccess={handleSuccess}>
            <Button>Nuevo Rol</Button>
          </RoleModal>
        </div>
        
        <RoleList
          key={refreshKey}
          onRoleSelect={roleId => {
            setSelectedRoleId(roleId);
            setRolePermissionModalOpen(true); 
          }}
        />
        
        {selectedRoleId && (
          <RolePermissionModal
            roleId={selectedRoleId}
            isOpen={isRolePermissionModalOpen}
            onClose={() => setRolePermissionModalOpen(false)}  
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </AppLayout>
  );
}
