<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('registros', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vehiculo_id');
            $table->unsignedBigInteger('espacio_id');
            $table->timestamp('entrada')->nullable(); 
            $table->timestamp('salida')->nullable();
            $table->decimal('tarifa', 8, 2)->nullable();
            $table->timestamps();

            $table->foreign('vehiculo_id')->references('id')->on('vehiculos');
            $table->foreign('espacio_id')->references('id')->on('espacios');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registros');
    }
};
