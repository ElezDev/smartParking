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

interface Vehiculo {
  id: number;
  placa: string;
  color: string;
  marca: string;
  modelo: string;
  cliente_id: number;
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
  const [filtro, setFiltro] = useState<"Todos" | "Carro" | "Moto">("Todos");

  useEffect(() => {
    axios
      .get("/api/espacios")
      .then((response) => {
        setEspacios(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar espacios:", error);
        setLoading(false);
      });
  }, []);

  const espaciosFiltrados =
    filtro === "Todos"
      ? espacios
      : espacios.filter((espacio) => espacio.tipo === filtro);

  const handleFinalizar = (espacioId: number) => {
    console.log("Finalizar estacionamiento para espacio:", espacioId);
    axios.get("/api/espacios").then(res => setEspacios(res.data));
  };

  return (
    <div className="p-6 w-full h-full space-y-4">
      <div className="flex justify-center gap-4">
        <Button
          variant={filtro === "Todos" ? "default" : "outline"}
          onClick={() => setFiltro("Todos")}
        >
          Todos
        </Button>
        <Button
          variant={filtro === "Carro" ? "default" : "outline"}
          onClick={() => setFiltro("Carro")}
        >
          Carros
        </Button>
        <Button
          variant={filtro === "Moto" ? "default" : "outline"}
          onClick={() => setFiltro("Moto")}
        >
          Motos
        </Button>
      </div>

      {loading ? (
        <p className="text-center">Cargando espacios...</p>
      ) : (
        <ScrollArea className="h-[calc(100vh-250px)] pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {espaciosFiltrados.map((espacio) => {
              const vehiculoActual = espacio.registros.find(
                (registro) => registro.salida === null
              )?.vehiculo;

              return (
                <Card key={espacio.id} className="rounded-2xl shadow-md">
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
                    <div className="flex justify-center">
                      {espacio.tipo === "Carro" ? (
                        <CarIcon size={40} className="text-blue-500" />
                      ) : (
                        <BikeIcon size={40} className="text-orange-500" />
                      )}
                    </div>

                    {/* Mostrar información del vehículo si está ocupado */}
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
                      </div>
                    )}

                    <div className="flex justify-between">
                      {espacio.disponible ? (
                        <AgregarVehiculoModal 
                          espacioId={espacio.id} 
                          onSuccess={() => {
                            axios.get("/api/espacios").then(res => setEspacios(res.data));
                          }} 
                        />
                      ) : (
                        <Button 
                          variant="destructive" 
                          className="w-full"
                          onClick={() => handleFinalizar(espacio.id)}
                        >
                          Finalizar
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
    </div>
  );
};

export default EspaciosList;