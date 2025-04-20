// components/user-modal.tsx
import { useState, useEffect, forwardRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserModalProps {
  children: React.ReactNode;
  onSuccess?: () => void;
  userToEdit?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

interface Role {
  id: number;
  name: string;
}

export function UserModal({ children, onSuccess, userToEdit }: UserModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: userToEdit?.name || "",
        email: userToEdit?.email || "",
        password: "",
        role: userToEdit?.role || (roles.length > 0 ? roles[0].name : ""),
      });
    }
  }, [open, userToEdit, roles]);

  useEffect(() => {
    const loadRoles = async () => {
      if (open && roles.length === 0) {
        setRolesLoading(true);
        try {
          const response = await axios.get("/api/roles");
          setRoles(response.data);
        } catch (error) {
          toast.error("Error al cargar los roles");
        } finally {
          setRolesLoading(false);
        }
      }
    };

    loadRoles();
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        ...(formData.password && { password: formData.password })
      };

      const response = userToEdit
        ? await axios.put(`/api/update-user/${userToEdit.id}`, payload)
        : await axios.post("/api/usuarios", payload);

      toast.success(
        `Usuario ${userToEdit ? "actualizado" : "creado"} exitosamente`
      );

      setOpen(false);
      onSuccess?.();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 422) {
          setErrors(error.response.data.errors || {});
        } else {
          toast.error(
            error.response.data.message || 
            (userToEdit ? "Error al actualizar el usuario" : "Error al crear el usuario")
          );
        }
      } else {
        toast.error("Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  // Componente CustomDialogTrigger para evitar problemas de focus
  const CustomDialogTrigger = forwardRef<HTMLButtonElement, { children: React.ReactNode }>(
    ({ children }, ref) => (
      <DialogTrigger asChild ref={ref}>
        {children}
      </DialogTrigger>
    )
  );
  CustomDialogTrigger.displayName = "CustomDialogTrigger";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <CustomDialogTrigger>
        {children}
      </CustomDialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {userToEdit ? "Editar Usuario" : "Nuevo Usuario"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ej: Juan Pérez"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Ej: usuario@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="password">
              {userToEdit ? "Nueva contraseña" : "Contraseña"}
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={
                userToEdit
                  ? "Dejar vacío para no cambiar"
                  : "Mínimo 8 caracteres"
              }
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div>
            <Label htmlFor="role">Rol</Label>
            <Select
              value={formData.role}
              onValueChange={handleRoleChange}
              disabled={loading || rolesLoading || roles.length === 0}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    rolesLoading
                      ? "Cargando roles..."
                      : roles.length === 0
                      ? "No hay roles disponibles"
                      : "Selecciona un rol"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                rolesLoading ||
                roles.length === 0
              }
            >
              {loading
                ? userToEdit
                  ? "Actualizando..."
                  : "Creando..."
                : userToEdit
                ? "Actualizar Usuario"
                : "Crear Usuario"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}