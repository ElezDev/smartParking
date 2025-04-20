<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tarifa extends Model
{
    
protected $table = 'tarifas';
    protected $guarded = [];

    public $timestamps = false;

    public function espacios()
    {
        return $this->hasMany(Espacio::class);
    }

    protected $casts = [
        'valor_hora' => 'decimal:2',
        'valor_dia' => 'decimal:2',
        'valor_minuto' => 'decimal:2',
        'valor_mes' => 'decimal:2',
    ];

    // Relación con registros (opcional)
    public function registros()
    {
        return $this->hasMany(Registro::class, 'tipo_vehiculo', 'tipo_vehiculo');
    }

    public static function calcularTarifa($tipoVehiculo, $minutosEstacionado)
    {
        // Validar que los minutos no sean negativos
        if ($minutosEstacionado < 0) {
            throw new \Exception("El tiempo estacionado no puede ser negativo: {$minutosEstacionado} minutos");
        }
    
        $tarifa = self::where('tipo_vehiculo', $tipoVehiculo)->first();
        
        if (!$tarifa) {
            throw new \Exception("Tarifa no encontrada para el tipo de vehículo: {$tipoVehiculo}");
        }
    
        // Redondear siempre hacia arriba para evitar fracciones de minuto no cobradas
        $minutosEstacionado = ceil($minutosEstacionado);
    
        // 1 mes = 30 días (43200 minutos)
        if ($minutosEstacionado >= 43200) { 
            return $tarifa->valor_mes;
        } 
        
        // 1 día = 1440 minutos
        if ($minutosEstacionado >= 1440) { 
            $dias = floor($minutosEstacionado / 1440);
            $minutosRestantes = $minutosEstacionado % 1440;
            $tarifaDias = $dias * $tarifa->valor_dia;
            
            // Evitar recursión para casos simples
            if ($minutosRestantes == 0) {
                return $tarifaDias;
            }
            return $tarifaDias + self::calcularTarifa($tipoVehiculo, $minutosRestantes);
        } 
        
        // 1 hora = 60 minutos
        if ($minutosEstacionado >= 60) { 
            $horas = floor($minutosEstacionado / 60);
            $minutosRestantes = $minutosEstacionado % 60;
            $tarifaHoras = $horas * $tarifa->valor_hora;
            
            if ($minutosRestantes == 0) {
                return $tarifaHoras;
            }
            return $tarifaHoras + ($minutosRestantes * $tarifa->valor_minuto);
        } 
        
        // Menos de 1 hora
        return $minutosEstacionado * $tarifa->valor_minuto;
    }
}
