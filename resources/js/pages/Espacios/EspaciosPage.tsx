import { useState } from 'react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import ModalEspacios from './ModalEspacios';
import EspaciosList from './EspaciosList';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Espacios',
        href: '/espacios',
    },
];

export default function EspaciosPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Clientes" />
            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4 min-h-[85vh]">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Espacios del Parqueadero</h1>
                    <ModalEspacios onSuccess={handleSuccess}>
                        <Button>Nuevo espacio</Button>
                    </ModalEspacios>
                </div>

                <EspaciosList key={refreshKey} />
            </div>
        </AppLayout>
    );
}
