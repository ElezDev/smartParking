import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { UserModal } from './UsuarioModal';
import { UserList } from './UsersList';

const breadcrumbs = [
    {
        title: 'Usuarios',
        href: '/Usuarios', 
    }
];
export default function UserPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Usuarios" /> 
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Gestión de usuarios</h1>
                    <UserModal onSuccess={handleSuccess}>
                        <Button>Nuevo Usario</Button>
                    </UserModal>
                </div>
                <UserList key={refreshKey} />
            </div>
        </AppLayout>
    );
}