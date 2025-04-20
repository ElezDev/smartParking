import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import RoleCreationForm from './RoleCreationForm';

interface RoleModalProps {
  children: React.ReactNode;
  onSuccess: () => void;
}

export function RoleModal({ children, onSuccess }: RoleModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    onSuccess();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Rol</DialogTitle>
        </DialogHeader>
        <RoleCreationForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}