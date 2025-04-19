import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import ClienteModal from "../Clientes/ClienteModal";

export default function AgregarVehiculoModal({
  espacioId,
  onSuccess,
}: {
  espacioId: number;
  onSuccess: () => void;
}) {
  const [cedula, setCedula] = useState("");
  const [cliente, setCliente] = useState<any>(null);
  const [placa, setPlaca] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [color, setColor] = useState("");
  const [showCrearCliente, setShowCrearCliente] = useState(false);
  const [vehiculoExiste, setVehiculoExiste] = useState(false);
  const [hora, setHora] = useState("");

  const obtenerHoraLegible = () => {
    const ahora = new Date();
    return ahora.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const buscarCliente = async () => {
    if (!cedula) return toast.error("Ingrese una cédula");
    try {
      const res = await axios.get(`/api/clientes-by-cc/${cedula}`);
      if (res.data) {
        setCliente(res.data);
        setShowCrearCliente(false);
        toast.success("Cliente encontrado");
      } else {
        setCliente(null);
        setShowCrearCliente(true);
        toast.info("Cliente no encontrado");
      }
    } catch (error) {
      console.error(error);
      setCliente(null);
      setShowCrearCliente(true);
      toast.error("Error al buscar cliente");
    }
  };

  const buscarVehiculoPorPlaca = async (placaInput: string) => {
    if (!placaInput) return;
    try {
      const res = await axios.get(`/api/vehiculos/placa/${placaInput}`);
      if (res.data) {
        setVehiculoExiste(true);
        setMarca(res.data.marca);
        setModelo(res.data.modelo);
        setColor(res.data.color);
        toast.success("Vehículo encontrado");
      } else {
        setVehiculoExiste(false);
        setMarca("");
        setModelo("");
        setColor("");
        toast.info("Vehículo no registrado");
      }
    } catch (error) {
      console.error(error);
      setVehiculoExiste(false);
      setMarca("");
      setModelo("");
      setColor("");
      toast.error("Error al buscar vehículo");
    }
  };

  const guardarVehiculo = async () => {
    if (!placa || !cedula) {
      return toast.error("Cédula y placa son obligatorios");
    }
  
    try {
      // Obtener fecha actual en hora local (Colombia UTC-5)
      const ahora = new Date();
      const offset = -5 * 60; // Colombia UTC-5 en minutos
      const horaLocal = new Date(ahora.getTime() + offset * 60 * 1000);
      const entradaFormatted = horaLocal.toISOString().slice(0, 19).replace('T', ' ');
  
      await axios.post("/api/registros", {
        cc: cedula,
        nombre: showCrearCliente ? cliente?.nombre : undefined,
        placa,
        marca: !vehiculoExiste ? marca : undefined,
        modelo: !vehiculoExiste ? modelo : undefined,
        color: !vehiculoExiste ? color : undefined,
        espacio_id: espacioId,
        nuevo_cliente: showCrearCliente,
        nuevo_vehiculo: !vehiculoExiste,
        entrada: entradaFormatted,
      });
      toast.success("Vehículo registrado correctamente");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar vehículo");
    }
  };
  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          setHora(obtenerHoraLegible());
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full">Agregar Vehículo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar vehículo</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Input
            placeholder="Cédula del cliente"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
          />
          <Button variant="outline" onClick={buscarCliente}>
            Buscar Cliente
          </Button>

          {cliente && (
            <div className="bg-green-100 border p-2 rounded">
              <p><strong>Cliente:</strong> {cliente.nombre}</p>
            </div>
          )}

          {showCrearCliente && (
            <ClienteModal
              onSuccess={async () => {
                await buscarCliente();
              }}
            >
              <Button variant="outline">Crear Cliente</Button>
            </ClienteModal>
          )}

          <Input
            placeholder="Placa"
            value={placa}
            onChange={(e) => {
              const value = e.target.value.toUpperCase();
              setPlaca(value);
              buscarVehiculoPorPlaca(value);
            }}
          />

          <Input
            placeholder="Marca"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            disabled={vehiculoExiste}
          />
          <Input
            placeholder="Modelo"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            disabled={vehiculoExiste}
          />
          <Input
            placeholder="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            disabled={vehiculoExiste}
          />

          <Input
            placeholder="Hora de entrada"
            value={hora}
            readOnly
          />
        </div>

        <DialogFooter className="pt-4">
          <Button onClick={guardarVehiculo}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
