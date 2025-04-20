<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tarifas', function (Blueprint $table) {
            $table->id();
            $table->enum('tipo_vehiculo', ['CARRO', 'MOTO', 'BICICLETA', 'OTRO']);
            $table->decimal('valor_hora', 8, 2);
            $table->decimal('valor_dia', 8, 2);
            $table->decimal('valor_minuto', 8, 2)->nullable(); 
            $table->decimal('valor_mes', 8, 2)->nullable(); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tarifas');
    }
};
