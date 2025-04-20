<?php


namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class UsuarioController extends Controller
{
    // 1. CRUD Básico

    public function index()
    {
        $users = User::with('roles')->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'roles' => $user->roles->pluck('name')->toArray(),
                'status' => $user->email_verified_at ? 'verified' : 'unverified'
            ];
        });

        return response()->json($users, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'role' => 'sometimes|string|exists:roles,name'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ]);

        if ($request->has('role')) {
            $user->assignRole($request->role);
        }

        return response()->json([
            'message' => 'Usuario creado exitosamente',
            'user' => $user->load('roles')
        ], 201);
    }

  

    public function updateUser(Request $request, $idUser)
    {
        $request->validate([
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $idUser,
            'password' => 'sometimes|min:8',
            'role' => 'sometimes|string|exists:roles,name'
        ]);

        $user = User::findOrFail($idUser);
        $user->update($request->only('name', 'email', 'password'));

        if ($request->has('role')) {
            $user->syncRoles([$request->role]);
        }

        return response()->json([
            'message' => 'Usuario actualizado exitosamente',
            'user' => $user->load('roles')
        ]);
      
    }

    public function deleteUsers($idUser)
    {
        $user = User::findOrFail($idUser);
        $user->delete();

        return response()->json([
            'message' => 'Usuario eliminado exitosamente'
        ]);
    }

    public function assignRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|string|exists:roles,name'
        ]);

        $user->syncRoles([$request->role]);

        return response()->json([
            'message' => 'Rol asignado correctamente',
            'user' => $user->only('id', 'name', 'email'),
            'role' => $user->getRoleNames()->first()
        ]);
    }
}