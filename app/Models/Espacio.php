<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Espacio extends Model
{
    protected $table = 'espacios';
    protected $guarded= [
      
    ];

    // Modelo Espacio
public function registros()
{
    return $this->hasMany(Registro::class);
}

}
