<?php

use App\Http\Controllers\ClienteController;
use App\Http\Controllers\EspacioController;
use App\Http\Controllers\RegistroController;
use App\Http\Controllers\VehiculoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::apiResource('clientes', ClienteController::class);
Route::apiResource('vehiculos', VehiculoController::class);
Route::apiResource('espacios', EspacioController::class);
Route::apiResource('registros', RegistroController::class);