<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Cliente::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:clientes,email',
            'telefono' => 'nullable|string|max:20',
            'direccion' => 'nullable|string|max:255'
        ]);

        $cliente = Cliente::create($request->all());
        return response()->json($cliente, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $cliente = Cliente::find($id);
        
        if (!$cliente) {
            return response()->json(['message' => 'Cliente no encontrado'], 404);
        }
        
        return response()->json($cliente);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $cliente = Cliente::find($id);
        
        if (!$cliente) {
            return response()->json(['message' => 'Cliente no encontrado'], 404);
        }
        
        $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:clientes,email,'.$id,
            'telefono' => 'nullable|string|max:20',
            'direccion' => 'nullable|string|max:255'
        ]);

        $cliente->update($request->all());
        return response()->json($cliente);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $cliente = Cliente::find($id);
        
        if (!$cliente) {
            return response()->json(['message' => 'Cliente no encontrado'], 404);
        }
        
        $cliente->delete();
        return response()->json(['message' => 'Cliente eliminado correctamente']);
    }
}