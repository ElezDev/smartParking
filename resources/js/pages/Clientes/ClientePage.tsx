import { useState } from 'react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ClienteList } from './ClienteList';
import { Button } from '@/components/ui/button';
import ClienteModal from './ClienteModal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clientes',
        href: '/clientes', 
    },
];

export default function Clientes() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Clientes" /> 
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
                    <ClienteModal onSuccess={handleSuccess}>
                        <Button>Nuevo Cliente</Button>
                    </ClienteModal>
                </div>
                
                <ClienteList key={refreshKey} />
            </div>
        </AppLayout>
    );
}