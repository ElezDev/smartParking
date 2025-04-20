<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Registro extends Model
{
    
    protected $guarded = [];
    protected $table = 'registros';
    protected $dates = ['entrada', 'salida', 'created_at', 'updated_at'];

    public function getEntradaLocalAttribute() {
        return $this->entrada->setTimezone('America/Bogota');
    }
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function vehiculo()
    {
        return $this->belongsTo(Vehiculo::class);
    }
    
    public function espacio()
    {
        return $this->belongsTo(Espacio::class);
    }
    // Modelo Espacio


}
