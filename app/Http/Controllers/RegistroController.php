<?php

namespace App\Http\Controllers;
use App\Models\Cliente;
use App\Models\Vehiculo;
use App\Models\Registro;
use App\Models\Espacio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RegistroController extends Controller
{

 
    public function store(Request $request)
    {
        $request->validate([
            'cc' => 'required|string',
            'nombre' => 'required_if:nuevo_cliente,true|string',
            'placa' => 'required|string',
            'marca' => 'required_if:nuevo_vehiculo,true|string',
            'modelo' => 'required_if:nuevo_vehiculo,true|string',
            'color' => 'required_if:nuevo_vehiculo,true|string',
            'espacio_id' => 'required|exists:espacios,id',
            'entrada' => 'required|date',
        ]);
    
        DB::beginTransaction();
    
        try {
            // Buscar o crear cliente
            if ($request->nuevo_cliente) {
                $cliente = Cliente::firstOrCreate(
                    ['cc' => $request->cc],
                    ['nombre' => $request->nombre]
                );
            } else {
                $cliente = Cliente::where('cc', $request->cc)->firstOrFail();
            }
    
            // Buscar o crear vehículo
            if ($request->nuevo_vehiculo) {
                $vehiculo = Vehiculo::firstOrCreate(
                    ['placa' => $request->placa],
                    [
                        'cliente_id' => $cliente->id,
                        'marca' => $request->marca,
                        'modelo' => $request->modelo,
                        'color' => $request->color,
                    ]
                );
            } else {
                $vehiculo = Vehiculo::where('placa', $request->placa)->firstOrFail();
            }
    
            // Verificar si el espacio está ocupado
            $espacio = Espacio::findOrFail($request->espacio_id);
            if ($espacio->disponible == 0) {
                return response()->json([
                    'error' => 'El espacio ya está ocupado',
                ], 400);
            }
    
            // Registrar entrada
            $registro = Registro::create([
                'vehiculo_id' => $vehiculo->id,
                'espacio_id' => $request->espacio_id,
                'entrada' => $request->entrada,
            ]);
    
            // Marcar espacio como ocupado
            $espacio->update(['disponible' => 0]);
    
            DB::commit();
    
            return response()->json([
                'message' => 'Vehículo registrado exitosamente',
                'registro' => $registro,
                'cliente' => $cliente,
                'vehiculo' => $vehiculo,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al registrar vehículo', ['error' => $e->getMessage()]);
            return response()->json([
                'error' => 'Error al registrar vehículo',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    
    

}

