<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // Limpiar cache de permisos
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Lista de permisos
        $permissions = [
            'gestionar usuarios',
            'gestionar roles',
            'gestionar parqueaderos',
            'registrar entradas',
            'registrar salidas',
            'generar reportes',
            'configurar sistema',
            'gestionar clientes',
            'gestionar espacios',
            'dashboard',
        ];

        // Crear permisos si no existen
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Rol operador con permisos limitados
        $operador = Role::firstOrCreate(['name' => 'operador']);
        $operador->givePermissionTo([
            'registrar entradas',
            'registrar salidas',
        ]);

        // Rol cliente (sin permisos específicos por ahora)
        $cliente = Role::firstOrCreate(['name' => 'cliente']);

        // Rol admin con todos los permisos
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->givePermissionTo(Permission::all());
    }
}
