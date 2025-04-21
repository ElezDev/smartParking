<?php

namespace App\Http\Controllers;
use App\Models\Cliente;
use App\Models\Tarifa;
use App\Models\Vehiculo;
use App\Models\Registro;
use App\Models\Espacio;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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
            'color' => 'required_if:nuevo_vehiculo,true|string',
            'espacio_id' => 'required|exists:espacios,id',
            'entrada' => 'required|date',
            'tipo_vehiculo' => 'required|string',
        ]);

        DB::beginTransaction();

        try {
            if ($request->nuevo_cliente) {
                $cliente = Cliente::firstOrCreate(
                    ['cc' => $request->cc],
                    ['nombre' => $request->nombre]
                );
            } else {
                $cliente = Cliente::where('cc', $request->cc)->firstOrFail();
            }

            if ($request->nuevo_vehiculo) {
                $vehiculo = Vehiculo::firstOrCreate(
                    ['placa' => $request->placa],
                    [
                        'cliente_id' => $cliente->id,
                        'marca' => $request->marca,
                        'modelo' => $request->modelo,
                        'color' => $request->color,
                        'tipo_vehiculo' => $request->tipo_vehiculo,
                    ]
                );
            } else {
                $vehiculo = Vehiculo::where('placa', $request->placa)->firstOrFail();
            }

            $espacio = Espacio::findOrFail($request->espacio_id);
            if ($espacio->disponible == 0) {
                return response()->json([
                    'error' => 'El espacio ya está ocupado',
                ], 400);
            }

            $registro = Registro::create([
                'vehiculo_id' => $vehiculo->id,
                'espacio_id' => $request->espacio_id,
                'entrada' => $request->entrada,
            ]);

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


    public function finalizarServicio(Request $request, $registro_id)
    {
        $registro = Registro::findOrFail($registro_id);

        if ($registro->salida !== null) {
            return response()->json(['error' => 'Este registro ya fue finalizado'], 400);
        }

        $request->validate([
            'tarifa' => 'required|numeric|min:0'
        ]);

        $registro->salida = Carbon::now();
        $registro->tarifa = $request->input('tarifa');
        $registro->save();

        Espacio::where('id', $registro->espacio_id)->update(['disponible' => 1]);

        return response()->json([
            'message' => 'Servicio finalizado correctamente',
            'registro' => $registro,
        ]);
    }


}

