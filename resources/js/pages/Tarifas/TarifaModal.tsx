import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { TarifaService } from '@/services/tarifa.service';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Esquema de validación
const tarifaSchema = z.object({
    tipo_vehiculo: z.string().min(1, 'El tipo de vehículo es requerido'),
    valor_hora: z.string().min(1, 'El valor por hora es requerido'),
    valor_dia: z.string().min(1, 'El valor por día es requerido'),
    valor_minuto: z.string().min(1, 'El valor por minuto es requerido'),
    valor_mes: z.string().min(1, 'El valor por mes es requerido'),
});

type TarifaFormValues = z.infer<typeof tarifaSchema>;

interface TarifaModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    tarifaId?: number | null;
}

const TarifaModal: React.FC<TarifaModalProps> = ({ 
    open, 
    onOpenChange, 
    onSuccess,
    tarifaId 
}) => {
    const form = useForm<TarifaFormValues>({
        resolver: zodResolver(tarifaSchema),
        defaultValues: {
            tipo_vehiculo: '',
            valor_hora: '',
            valor_dia: '',
            valor_minuto: '',
            valor_mes: '',
        },
    });

    const { reset, handleSubmit, formState: { isSubmitting } } = form;

    useEffect(() => {
        if (!open) {
            reset();
            return;
        }

        if (tarifaId) {
            const loadTarifa = async () => {
                try {
                    const tarifa = await TarifaService.getById(tarifaId);
                    reset({
                        tipo_vehiculo: tarifa.tipo_vehiculo,
                        valor_hora: tarifa.valor_hora,
                        valor_dia: tarifa.valor_dia,
                        valor_minuto: tarifa.valor_minuto,
                        valor_mes: tarifa.valor_mes,
                    });
                } catch (error) {
                    onOpenChange(false);
                }
            };
            loadTarifa();
        }
    }, [open, tarifaId, reset, onOpenChange]);

    const onSubmit = async (data: TarifaFormValues) => {
        try {
            if (tarifaId) {
                await TarifaService.update(tarifaId, data);
            } else {
                await TarifaService.create(data);
            }
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Error al guardar la tarifa:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {tarifaId ? 'Editar Tarifa' : 'Nueva Tarifa'}
                    </DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="tipo_vehiculo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Vehículo</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Ej: Carro, Moto, Bicicleta" 
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="valor_hora"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Valor por Hora ($)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                placeholder="Ej: 3000" 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="valor_dia"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Valor por Día ($)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                placeholder="Ej: 20000" 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="valor_minuto"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Valor por Minuto ($)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                placeholder="Ej: 100" 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="valor_mes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Valor por Mes ($)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                placeholder="Ej: 150000" 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <DialogFooter>
                            <Button 
                                variant="outline" 
                                onClick={() => onOpenChange(false)}
                                type="button"
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {tarifaId ? 'Actualizar' : 'Crear'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default TarifaModal;