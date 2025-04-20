// components/user-modal.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { userService } from "@/services/usersService";
import { fetchRoles, RoleResponse } from "@/services/rolesService";

const userFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingresa un email válido.",
  }),
  password: z
    .string()
    .min(8, {
      message: "La contraseña debe tener al menos 8 caracteres.",
    })
    .optional()
    .or(z.literal("")),
  role: z.string().min(1, "Debes seleccionar un rol"),
});

type UserFormValues = z.infer<typeof userFormSchema>;

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

export function UserModal({ children, onSuccess, userToEdit }: UserModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
  });

  // Cargar roles cuando se abre el modal
  useEffect(() => {
    const loadRoles = async () => {
      if (open && roles.length === 0) {
        setRolesLoading(true);
        try {
          const rolesData = await fetchRoles();
          setRoles(rolesData);
        } catch (error) {
          toast.error("Error al cargar los roles");
        } finally {
          setRolesLoading(false);
        }
      }
    };

    loadRoles();
  }, [open]);

  // Resetear formulario cuando cambia el estado de apertura o el usuario a editar
  useEffect(() => {
    if (open) {
      form.reset({
        name: userToEdit?.name || "",
        email: userToEdit?.email || "",
        password: "",
        role: userToEdit?.role || (roles.length > 0 ? roles[0].name : ""),
      });
    }
  }, [open, userToEdit, roles]);

  const onSubmit = async (data: UserFormValues) => {
    setLoading(true);
    try {
      if (userToEdit) {
        // Actualizar usuario existente
        const updatedUser = await userService.updateUser(
          userToEdit.id.toString(),
          {
            name: data.name,
            email: data.email,
            ...(data.password && { password: data.password }),
            role: data.role,
          }
        );
        toast.success(`Usuario ${updatedUser.name} actualizado exitosamente`);
      } else {
        // Crear nuevo usuario
        const newUser = await userService.createUser({
          name: data.name,
          email: data.email,
          password: data.password || "",
          role: data.role,
        });
        toast.success(`Usuario ${newUser.name} creado exitosamente`);
      }

      setOpen(false);
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(errors[key][0]);
        });
      } else {
        toast.error(
          userToEdit
            ? "Error al actualizar el usuario"
            : "Error al crear el usuario"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()} // Evita cerrar al hacer clic fuera
      >
        <DialogHeader>
          <DialogTitle>
            {userToEdit ? "Editar Usuario" : "Nuevo Usuario"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Juan Pérez"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Ej: usuario@example.com"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {userToEdit ? "Nueva contraseña" : "Contraseña"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        userToEdit
                          ? "Dejar vacío para no cambiar"
                          : "Mínimo 8 caracteres"
                      }
                      {...field}
                      value={field.value || ""}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={loading || rolesLoading || roles.length === 0}
                  >
                    <FormControl>
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
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem
                          key={role.id}
                          value={role.name}
                          onSelect={(e) => e.preventDefault()}
                        >
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  roles.length === 0 ||
                  !form.formState.isDirty
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}