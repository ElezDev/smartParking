import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, Calendar, DollarSign, Car, Bike } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import axios from "axios";
import { toast } from "sonner";

interface FinalizarServicioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registro: {
    id: number;
    entrada: string;
    vehiculo: {
      placa: string;
      color: string;
      marca: string;
      modelo: string;
      tipo_vehiculo: string;
    };
  };
  onFinalizar: (registroId: number, tarifa: number) => Promise<void>;
}

export function FinalizarServicioModal({
  open,
  onOpenChange,
  registro,
  onFinalizar,
}: FinalizarServicioModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [tarifaCalculada, setTarifaCalculada] = React.useState<number | null>(null);
  const [tiempoTranscurrido, setTiempoTranscurrido] = React.useState("");
  const [detalleTarifa, setDetalleTarifa] = React.useState("");

  const calcularTiempoYTarifa = React.useCallback(async () => {
    const entrada = new Date(registro.entrada);
    const ahora = new Date();
    
    const calcularDuracionLegible = (entrada: Date, salida: Date): string => {
      const diffMs = salida.getTime() - entrada.getTime();
      const totalMin = Math.floor(diffMs / 60000);
    
      const dias = Math.floor(totalMin / (60 * 24));
      const horas = Math.floor((totalMin % (60 * 24)) / 60);
      const minutos = totalMin % 60;
    
      const partes = [];
      if (dias > 0) partes.push(`${dias} día${dias > 1 ? 's' : ''}`);
      if (horas > 0) partes.push(`${horas} hora${horas > 1 ? 's' : ''}`);
      if (minutos > 0 || partes.length === 0) partes.push(`${minutos} minuto${minutos > 1 ? 's' : ''}`);
    
      return partes.join(", ");
    };
    
    const tiempo = calcularDuracionLegible(entrada, ahora);
    setTiempoTranscurrido(tiempo || "0 minutos");

    const diffMs = ahora.getTime() - entrada.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    try {
      const response = await axios.get("/api/calcular-tarifa", {
        params: {
          tipoVehiculo: registro.vehiculo.tipo_vehiculo,
          minutos: diffMins
        }
      });
      
      setTarifaCalculada(response.data.tarifa);
      setDetalleTarifa(response.data.detalle || "");
    } catch (error) {
      console.error("Error calculando tarifa:", error);
      toast.error("Error al calcular la tarifa");
      
      setTarifaCalculada(registro.vehiculo.tipo_vehiculo === "Carro" ? 3000 : 1500);
      setDetalleTarifa("Tarifa estándar aplicada");
    }
  }, [registro]);

  React.useEffect(() => {
    if (open && registro) {
      calcularTiempoYTarifa();
      const interval = setInterval(calcularTiempoYTarifa, 60000);
      return () => clearInterval(interval);
    }
  }, [open, registro, calcularTiempoYTarifa]);

  const handleFinalizar = async () => {
    if (tarifaCalculada === null) return; // Protección
  
    setLoading(true);
    try {
      await onFinalizar(registro.id, tarifaCalculada); // ← enviamos la tarifa
      toast.success("Servicio finalizado correctamente");
      onOpenChange(false);
    } catch (error) {
      toast.error("Error al finalizar el servicio");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Finalizar servicio de estacionamiento</DialogTitle>
          <DialogDescription>
            Revise los detalles antes de confirmar la finalización
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información del vehículo */}
          <div className="flex items-center gap-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {registro.vehiculo.tipo_vehiculo === "Carro" ? (
              <Car className="h-8 w-8 text-blue-500" />
            ) : (
              <Bike className="h-8 w-8 text-orange-500" />
            )}
            <div>
              <h4 className="font-semibold">{registro.vehiculo.marca} {registro.vehiculo.modelo}</h4>
              <div className="flex items-center gap-2 text-sm">
                <span>Placa: {registro.vehiculo.placa}</span>
                <span 
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: registro.vehiculo.color.toLowerCase() }}
                />
              </div>
            </div>
          </div>

          {/* Detalles de tiempo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Entrada</p>
                <p className="font-medium">
                  {format(new Date(registro.entrada), "PPp")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Clock className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Tiempo estacionado</p>
                <p className="font-medium">{tiempoTranscurrido}</p>
              </div>
            </div>
          </div>

          {/* Tarifa */}
          <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-primary-500" />
              <div>
                <p className="text-sm text-primary-500">Tarifa calculada</p>
                <p className="font-bold text-lg">
                  {tarifaCalculada !== null ? 
                    `$${tarifaCalculada.toLocaleString("es-CO")}` : 
                    "Calculando..."}
                </p>
              </div>
            </div>
            {detalleTarifa && (
              <p className="text-xs text-muted-foreground">{detalleTarifa}</p>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleFinalizar}
              disabled={loading || tarifaCalculada === null}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Confirmar y finalizar"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}