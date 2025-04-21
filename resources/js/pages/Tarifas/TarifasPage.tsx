import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import TarifasList from './TarifasList';
import { toast } from 'sonner';
import TarifaModal from './TarifaModal';

const breadcrumbs = [
    {
        title: 'Tarifas',
        href: '/tarifas', 
    }
];

const TarifasPage = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentTarifaId, setCurrentTarifaId] = useState<number | null>(null);

    const handleSuccess = () => {
        setRefreshKey(prev => prev + 1);
        toast.success('Operación realizada con éxito');
    };

    const handleEdit = (id: number) => {
        setCurrentTarifaId(id);
        setModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Tarifas" /> 
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Gestión de Tarifas</h1>
                    <Button onClick={() => {
                        setCurrentTarifaId(null);
                        setModalOpen(true);
                    }}>
                        Nueva Tarifa
                    </Button>
                </div>
                
                <TarifasList 
                    key={refreshKey} 
                    onEdit={handleEdit}
                    onSuccess={handleSuccess}
                />
                
                <TarifaModal
                    open={modalOpen}
                    onOpenChange={setModalOpen}
                    onSuccess={handleSuccess}
                    tarifaId={currentTarifaId}
                />
            </div>
        </AppLayout>
    );
};

export default TarifasPage;