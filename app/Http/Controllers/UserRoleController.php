<?php


namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Validator;

class UserRoleController extends Controller
{
    /**
     * Assign roles to a user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $userId
     * @return \Illuminate\Http\Response
     */
    public function assignRoles(Request $request, $userId)
    {
        $validator = Validator::make($request->all(), [
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,name'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::findOrFail($userId);
            $user->syncRoles($request->roles);

            return response()->json([
                'success' => true,
                'data' => $user->load('roles'),
                'message' => 'Roles assigned successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to assign roles',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove a role from a user.
     *
     * @param  int  $userId
     * @param  string  $roleName
     * @return \Illuminate\Http\Response
     */
    public function removeRole($userId, $roleName)
    {
        try {
            $user = User::findOrFail($userId);
            $user->removeRole($roleName);

            return response()->json([
                'success' => true,
                'data' => $user->load('roles'),
                'message' => 'Role removed successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove role',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user roles.
     *
     * @param  int  $userId
     * @return \Illuminate\Http\Response
     */
    public function getUserRoles($userId)
    {
        try {
            $user = User::findOrFail($userId);
            return response()->json([
                'success' => true,
                'data' => $user->getRoleNames()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get user roles',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user permissions (direct and via roles).
     *
     * @param  int  $userId
     * @return \Illuminate\Http\Response
     */
    public function getUserPermissions($userId)
    {
        try {
            $user = User::findOrFail($userId);
            return response()->json([
                'success' => true,
                'data' => $user->getAllPermissions()->pluck('name')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get user permissions',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}