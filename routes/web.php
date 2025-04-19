<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    //clientes
      Route::get('/clientes', function () {
        return Inertia::render('Clientes/ClientePage');
    })->name('clientes');
    
    Route::get('/clientes/ClienteModal', function () {
        return Inertia::render('Clientes/ClienteModal');
    })->name('clientes.create');
    
    Route::get('/clientes/{cliente}/ClienteModal', function () {
        return Inertia::render('Clientes/ClienteModal');
    })->name('clientes.edit');

    //espacios
    Route::get('/espacios', function () {
        return Inertia::render('Espacios/EspaciosPage');
    })->name('espacios');

    Route::get('/espacios/EspacioModal', function () {
        return Inertia::render('Espacios/EspacioModal');
    })->name('espacios.create');
    Route::get('/espacios/{espacio}/EspacioModal', function () {
        return Inertia::render('Espacios/EspacioModal');
    })->name('espacios.edit');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
