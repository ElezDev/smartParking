<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

class PermissionsController extends Controller
{
    /**
     * Display a listing of the permissions.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $permissions = Permission::all();
            return response()->json( $permissions);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve permissions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created permission.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:permissions|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $permission = Permission::create(['name' => $request->name, 'guard_name' => 'api']);

            return response()->json([
                'success' => true,
                'data' => $permission,
                'message' => 'Permission created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create permission',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified permission.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $permission = Permission::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $permission
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Permission not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified permission.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:permissions,name,'.$id.'|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $permission = Permission::findOrFail($id);
            $permission->name = $request->name;
            $permission->save();

            return response()->json([
                'success' => true,
                'data' => $permission,
                'message' => 'Permission updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update permission',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified permission.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $permission = Permission::findOrFail($id);
            $permission->delete();

            return response()->json([
                'success' => true,
                'message' => 'Permission deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete permission',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function PermissionByRole($roleId)
{
    try {
        $role = Role::findById($roleId, 'web'); 
        if (!$role) {
            return response()->json(['message' => 'Role not found'], 404);
        }
        $permissions = $role->permissions->pluck('name', 'id');
        return response()->json([
            'permissions' => $permissions,
            'role' => $role->only(['id', 'name'])
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error retrieving permissions',
            'error' => $e->getMessage()
        ], 500);
    }
}
    
       
}