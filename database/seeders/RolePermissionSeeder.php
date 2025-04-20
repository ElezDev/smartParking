<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'gestionar usuarios',
            'gestionar roles',
            'gestionar parqueaderos',
            'registrar entradas',
            'registrar salidas',
            'generar reportes',
            'configurar sistema'
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // $admin = Role::create(['name' => 'admin']);
        // $admin->givePermissionTo(Permission::all());

        $operador = Role::create(['name' => 'operador']);
        $operador->givePermissionTo([
            'registrar entradas',
            'registrar salidas'
        ]);

        $cliente = Role::create(['name' => 'cliente']);
    }
}