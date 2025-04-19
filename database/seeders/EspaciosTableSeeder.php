<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EspaciosTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $espacios = [];

        // Crear 10 espacios para carros
        for ($i = 1; $i <= 10; $i++) {
            $espacios[] = [
                'numero' => 'C-' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'tipo' => 'Carro',
                'disponible' => rand(0, 1),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Crear 8 espacios para motos
        for ($i = 1; $i <= 8; $i++) {
            $espacios[] = [
                'numero' => 'M-' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'tipo' => 'Moto',
                'disponible' => rand(0, 1),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Crear 2 espacios de otro tipo
        for ($i = 1; $i <= 2; $i++) {
            $espacios[] = [
                'numero' => 'O-' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'tipo' => 'Otro',
                'disponible' => rand(0, 1),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('espacios')->insert($espacios);
    }
}