import { useState } from 'react';
import { createRole } from '@/services/rolesService';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RoleCreationFormProps {
  onSuccess: () => void;
}

const RoleCreationForm = ({ onSuccess }: RoleCreationFormProps) => {
  const [roleName, setRoleName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRole = async () => {
    if (!roleName.trim()) {
      toast.error('Role name is required');
      return;
    }

    setIsLoading(true);
    try {
      await createRole({ name: roleName });
      onSuccess();
      setRoleName('');
      toast.success('Role created successfully');
    } catch (error) {
      console.error('Error creating role', error);
      toast.error('Failed to create role');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="role-name">Nombre</Label>
        <Input
          id="role-name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="Nombre del rol"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setRoleName('');
            onSuccess();
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleCreateRole} disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Role'}
        </Button>
      </div>
    </div>
  );
};

export default RoleCreationForm;