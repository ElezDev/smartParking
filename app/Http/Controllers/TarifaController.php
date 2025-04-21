<?php

namespace App\Http\Controllers;

use App\Models\Tarifa;
use Illuminate\Http\Request;

class TarifaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tarifas = Tarifa::all();
        return response()->json($tarifas);
    }



    public function show(Tarifa $tarifa)
    {
        return response()->json($tarifa);
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $tarifa = Tarifa::create($request->all());
        return response()->json($tarifa, 201);
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tarifa $tarifa)
    {
        $tarifa->update($request->all());
        return response()->json($tarifa);
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tarifa $tarifa)
    {
        $tarifa->delete();
        return response()->json(null, 204);
        //
        
    }

    public function calcularTarifa(Request $request)
    {
        $request->validate([
            'tipoVehiculo' => 'required|in:CARRO,MOTO,VICILETA,OTRO',
            'minutos' => 'required|numeric'
        ]);

        $tarifa = Tarifa::calcularTarifa(
            $request->tipoVehiculo, 
            $request->minutos
        );

        return response()->json(['tarifa' => $tarifa]);
    }
}
