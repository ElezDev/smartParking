import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PermissionAssignmentForm from './PermissionAssignmentForm';

interface RolePermissionModalProps {
  roleId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RolePermissionModal({
  roleId,
  isOpen,
  onClose,
  onSuccess,
}: RolePermissionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gestionar Permisos del Rol</DialogTitle>
        </DialogHeader>
        <PermissionAssignmentForm
          roleId={roleId.toString()}
          onSuccess={() => {
            onSuccess();
            onClose(); 
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
