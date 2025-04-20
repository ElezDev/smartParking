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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import ClienteModal from "../Clientes/ClienteModal";
import { Plus } from "lucide-react";

type TipoVehiculo = "CARRO" | "MOTO" | "BICICLETA" | "OTRO";

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
  const [tipoVehiculo, setTipoVehiculo] = useState<TipoVehiculo>("CARRO");
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
        setTipoVehiculo(res.data.tipo_vehiculo || "CARRO");
        setColor(res.data.color);
        toast.success("Vehículo encontrado");
      } else {
        setVehiculoExiste(false);
        setMarca("");
        setTipoVehiculo("CARRO");
        setColor("");
        toast.info("Vehículo no registrado");
      }
    } catch (error) {
      console.error(error);
      setVehiculoExiste(false);
      setMarca("");
      setTipoVehiculo("CARRO");
      setColor("");
      toast.error("Error al buscar vehículo");
    }
  };

  const guardarVehiculo = async () => {
    if (!placa || !cedula) {
      return toast.error("Cédula y placa son obligatorios");
    }

    try {
      const ahora = new Date();
      const offset = -5 * 60;
      const horaLocal = new Date(ahora.getTime() + offset * 60 * 1000);
      const entradaFormatted = horaLocal
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      await axios.post("/api/registros", {
        cc: cedula,
        nombre: showCrearCliente ? cliente?.nombre : undefined,
        placa,
        marca: !vehiculoExiste ? marca : undefined,
        tipo_vehiculo: tipoVehiculo,
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
          {/* Input de cédula + botón buscar + botón + */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Cédula del cliente"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
            />
            <Button variant="outline" onClick={buscarCliente}>
              Buscar
            </Button>
            <ClienteModal
              onSuccess={async () => {
                await buscarCliente();
              }}
            >
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Plus className="h-5 w-5" />
              </Button>
            </ClienteModal>
          </div>

          {cliente && (
            <div className="bg-green-100 border p-2 rounded">
              <p>
                <strong>Cliente:</strong> {cliente.nombre}
              </p>
            </div>
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

          <Select
            value={tipoVehiculo}
            onValueChange={(value: TipoVehiculo) => setTipoVehiculo(value)}
            disabled={vehiculoExiste}
            
            >
            <SelectTrigger>
              <SelectValue placeholder="Tipo de vehículo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CARRO">Carro</SelectItem>
              <SelectItem value="MOTO">Moto</SelectItem>
              <SelectItem value="BICICLETA">Bicicleta</SelectItem>
              <SelectItem value="OTRO">Otro</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            disabled={vehiculoExiste}
          />

          <Input placeholder="Hora de entrada" value={hora} readOnly />
        </div>

        <DialogFooter className="pt-4">
          <Button onClick={guardarVehiculo}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
