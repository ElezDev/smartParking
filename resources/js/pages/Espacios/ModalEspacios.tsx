import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";

type ClienteModalProps = {
  data?: any;
  children: React.ReactNode;
  onSuccess?: () => void;
};

const ModalEspacios = ({ data, children, onSuccess }: ClienteModalProps) => {
  const [open, setOpen] = useState(false);
  const [numero, setNumero] = useState("");
  const [tipo, setTipo] = useState("Carro");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!numero || !tipo) return;

    try {
      setLoading(true);
      await axios.post("/api/espacios", {
        numero,
        tipo,
        disponible: 1,
      });

      setOpen(false);
      setNumero("");
      setTipo("Carro");

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al crear espacio:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear nuevo espacio</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="numero">Número</Label>
            <Input
              id="numero"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder="Ej: A1, B2, etc."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tipo">Tipo</Label>
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="border rounded-md p-2"
            >
              <option value="Carro">Carro</option>
              <option value="Moto">Moto</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEspacios;
