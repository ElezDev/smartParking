<?php

namespace App\Http\Controllers;

use App\Models\Espacio;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EspacioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $espacios = Espacio::with(['registros.vehiculo'])->get();
        return response()->json($espacios);
    }
    
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'numero' => 'required|string|max:255|unique:espacios,numero',
            'tipo' => ['required', Rule::in(['Carro', 'Moto', 'Otro'])],
            'disponible' => 'sometimes|boolean'
        ]);

        $espacio = Espacio::create($validated);
        return response()->json($espacio, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $espacio = Espacio::find($id);
        
        if (!$espacio) {
            return response()->json([
                'message' => 'Espacio no encontrado'
            ], 404);
        }
        
        return response()->json($espacio);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $espacio = Espacio::find($id);
        
        if (!$espacio) {
            return response()->json([
                'message' => 'Espacio no encontrado'
            ], 404);
        }

        $validated = $request->validate([
            'numero' => 'sometimes|string|max:255|unique:espacios,numero,'.$id,
            'tipo' => ['sometimes', Rule::in(['Carro', 'Moto', 'Otro'])],
            'disponible' => 'sometimes|boolean'
        ]);

        $espacio->update($validated);
        return response()->json($espacio);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $espacio = Espacio::find($id);
        
        if (!$espacio) {
            return response()->json([
                'message' => 'Espacio no encontrado'
            ], 404);
        }
        
        $espacio->delete();
        return response()->json([
            'message' => 'Espacio eliminado correctamente'
        ]);
    }

    /**
     * Método adicional para buscar espacios disponibles por tipo
     */
    public function disponibles($tipo = null)
    {
        $query = Espacio::where('disponible', true);
        
        if ($tipo) {
            $query->where('tipo', $tipo);
        }
        
        $espacios = $query->get();
        return response()->json($espacios);
    }
}