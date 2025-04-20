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
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Tarifa $tarifa)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tarifa $tarifa)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tarifa $tarifa)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tarifa $tarifa)
    {
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
