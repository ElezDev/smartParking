<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    protected $table = 'clientes';
    protected $guarded = [];

    public function vehiculos()
    {
        return $this->hasMany(Vehiculo::class);
    }
    public function espacios()
    {
        return $this->hasMany(Espacio::class);
    }
}
