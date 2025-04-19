<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Registro extends Model
{
    
    protected $guarded = [];
    protected $table = 'registros';

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
