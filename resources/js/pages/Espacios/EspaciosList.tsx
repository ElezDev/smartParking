import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CarIcon, BikeIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react";
import AgregarVehiculoModal from "./AgregarVehiculoModal";
import { FinalizarServicioModal } from "./FinalizarServicioModal";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Vehiculo {
  id: number;
  placa: string;
  color: string;
  marca: string;
  modelo: string;
  tipo: string;
  cliente_id: number;
  tipo_vehiculo: string;
  created_at: string;
  updated_at: string;
}

interface Registro {
  id: number;
  vehiculo_id: number;
  espacio_id: number;
  entrada: string;
  salida: string | null;
  tarifa: number | null;
  created_at: string;
  updated_at: string;
  vehiculo: Vehiculo;
}

interface Espacio {
  id: number;
  numero: string;
  tipo: string;
  disponible: number;
  created_at: string;
  updated_at: string;
  registros: Registro[];
}

const EspaciosList = () => {
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<"Todos" | "CARRO" | "MOTO" | "BICICLETA">("Todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [registroSeleccionado, setRegistroSeleccionado] = useState<Registro | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const cargarEspacios = async () => {
    try {
      const response = await axios.get("/api/espacios");
      setEspacios(response.data);
    } catch (error) {
      console.error("Error al cargar espacios:", error);
      toast.error("Error al cargar espacios");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarEspacios();
  }, []);

  const espaciosFiltrados = filtro === "Todos"
    ? espacios
    : espacios.filter((espacio) => espacio.tipo === filtro);

  const handleFinalizarClick = (espacioId: number) => {
    const espacio = espacios.find(e => e.id === espacioId);
    if (espacio) {
      const registroActivo = espacio.registros.find(r => r.salida === null);
      if (registroActivo) {
        setRegistroSeleccionado(registroActivo);
        setModalOpen(true);
      } else {
        toast.warning("No hay servicio activo en este espacio");
      }
    }
  };

  const confirmarFinalizar = async (registroId: number, tarifa: number) => {
    try {
      await axios.post(`/api/registros/${registroId}/finalizar`, {
        tarifa,
      });
      toast.success("Servicio finalizado correctamente");
      setRefreshing(true);
      await cargarEspacios();
    } catch (error) {
      console.error("Error finalizando servicio:", error);
      toast.error("Error al finalizar servicio");
      throw error;
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    cargarEspacios();
  };

  // Función para obtener el icono y color según el tipo de espacio
  const getIconoEspacio = (tipo: string) => {
    switch (tipo) {
      case "CARRO":
        return {
          icon: <CarIcon size={40} />,
          color: "text-blue-500",
          bgColor: "bg-blue-100",
          borderColor: "border-blue-300"
        };
      case "MOTO":
        return {
          icon: <BikeIcon size={40} />,
          color: "text-orange-500",
          bgColor: "bg-orange-100",
          borderColor: "border-orange-300"
        };
      case "BICICLETA":
        return {
          icon: <BikeIcon size={40} />,
          color: "text-green-500",
          bgColor: "bg-green-100",
          borderColor: "border-green-300"
        };
      default:
        return {
          icon: <CarIcon size={40} />,
          color: "text-gray-500",
          bgColor: "bg-gray-100",
          borderColor: "border-gray-300"
        };
    }
  };

  return (
    <div className="p-6 w-full h-full space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Espacios</h1>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? "Actualizando..." : "Actualizar"}
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex justify-center gap-4">
        <Button
          variant={filtro === "Todos" ? "default" : "outline"}
          onClick={() => setFiltro("Todos")}
        >
          Todos
        </Button>
        <Button
          variant={filtro === "CARRO" ? "default" : "outline"}
          onClick={() => setFiltro("CARRO")}
        >
          <CarIcon className="w-4 h-4 mr-2" />
          Carros
        </Button>
        <Button
          variant={filtro === "MOTO" ? "default" : "outline"}
          onClick={() => setFiltro("MOTO")}
        >
          <BikeIcon className="w-4 h-4 mr-2" />
          Motos
        </Button>
        <Button
          variant={filtro === "BICICLETA" ? "default" : "outline"}
          onClick={() => setFiltro("BICICLETA")}
        >
          <BikeIcon className="w-4 h-4 mr-2" />
          Bicicletas
        </Button>
      </div>

      {/* Listado de espacios */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[200px] rounded-xl" />
          ))}
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-250px)] pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {espaciosFiltrados.map((espacio) => {
              const vehiculoActual = espacio.registros.find(
                (registro) => registro.salida === null
              )?.vehiculo;
              const { icon, color, bgColor, borderColor } = getIconoEspacio(espacio.tipo);

              return (
                <Card 
                  key={espacio.id} 
                  className={`rounded-2xl shadow-md hover:shadow-lg transition-shadow border ${borderColor}`}
                >
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">
                      {espacio.numero} - {espacio.tipo}
                    </CardTitle>
                    <Badge
                      variant={espacio.disponible ? "default" : "destructive"}
                      className="flex items-center gap-1"
                    >
                      {espacio.disponible ? (
                        <>
                          <CheckCircle2Icon size={14} />
                          Libre
                        </>
                      ) : (
                        <>
                          <XCircleIcon size={14} />
                          Ocupado
                        </>
                      )}
                    </Badge>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className={`flex justify-center p-4 rounded-lg ${bgColor}`}>
                      <div className={color}>
                        {icon}
                      </div>
                    </div>

                    {!espacio.disponible && vehiculoActual && (
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Placa:</span>
                          <Badge variant="secondary">
                            {vehiculoActual.placa}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="font-medium">Color:</span>
                          <div className="flex items-center gap-2">
                            <span>{vehiculoActual.color}</span>
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: vehiculoActual.color.toLowerCase() }}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="font-medium">Tipo:</span>
                          <Badge variant="outline">
                            {vehiculoActual.tipo_vehiculo}
                          </Badge>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between">
                      {espacio.disponible ? (
                        <AgregarVehiculoModal 
                          espacioId={espacio.id} 
                          onSuccess={cargarEspacios}
                        />
                      ) : (
                        <Button 
                          variant="destructive" 
                          className="w-full"
                          onClick={() => handleFinalizarClick(espacio.id)}
                        >
                          Finalizar Servicio
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      )}

      {registroSeleccionado && (
        <FinalizarServicioModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          registro={registroSeleccionado}
          onFinalizar={confirmarFinalizar}
        />
      )}
    </div>
  );
};

export default EspaciosList;