<?php

use App\Http\Controllers\ClienteController;
use App\Http\Controllers\EspacioController;
use App\Http\Controllers\PermissionsController;
use App\Http\Controllers\RegistroController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\TarifaController;
use App\Http\Controllers\VehiculoController;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Ruta protegida con Sanctum
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {

    Route::apiResource('clientes', ClienteController::class);
    Route::get('/clientes-by-cc/{cedula}', [ClienteController::class, 'showByCedula']);

    Route::apiResource('vehiculos', VehiculoController::class);
    Route::get('/vehiculos/placa/{placa}', [VehiculoController::class, 'showByPlaca']);

    Route::apiResource('espacios', EspacioController::class);

    Route::apiResource('registros', RegistroController::class);
    Route::post('/registros/{registro}/finalizar', [RegistroController::class, 'finalizarServicio']);

    Route::get('/calcular-tarifa', [TarifaController::class, 'calcularTarifa']);

    Route::apiResource('roles', RolesController::class)->except(['create', 'edit']);
    Route::apiResource('permissions', PermissionsController::class)->except(['create', 'edit']);
    Route::get('/roles/{roleId}/permissionsAsignados', [PermissionsController::class, 'PermissionByRole']);
    Route::post('/roles/{role}/permissionsassing', [RolesController::class, 'assignPermissions']);

});
