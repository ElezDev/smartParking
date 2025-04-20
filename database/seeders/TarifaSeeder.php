<?php

namespace Database\Seeders;

use App\Models\Tarifa;
use Illuminate\Database\Seeder;

class TarifaSeeder extends Seeder
{
    public function run()
    {
        $tarifas = [
            [
                'tipo_vehiculo' => 'CARRO',
                'valor_hora' => 3000,
                'valor_dia' => 20000,
                'valor_minuto' => 100,
                'valor_mes' => 150000,
            ],
            [
                'tipo_vehiculo' => 'MOTO',
                'valor_hora' => 1500,
                'valor_dia' => 10000,
                'valor_minuto' => 50,
                'valor_mes' => 80000,
            ],
            [
                'tipo_vehiculo' => 'BICICLETA',
                'valor_hora' => 5000,
                'valor_dia' => 30000,
                'valor_minuto' => 150,
                'valor_mes' => 200000,
            ],
            [
                'tipo_vehiculo' => 'OTRO',
                'valor_hora' => 5000,
                'valor_dia' => 30000,
                'valor_minuto' => 150,
                'valor_mes' => 200000,
            ],
        ];

        foreach ($tarifas as $tarifa) {
            Tarifa::create($tarifa);
        }
    }
}