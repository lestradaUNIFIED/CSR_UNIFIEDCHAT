<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


$routes = ['/', 
           '/chat', 
           '/chat/dm/{room_code}/{customer_id}/{room_id}/{queue_id}/{room_status_code}', 
           '/user', 
           '/video-call', 
           '/reports', 
           '/reports/queue',
           '/reports/users',
           '/reports/clients'
        ];

foreach ($routes as $route => $value) {
    Route::get($value, function () {
        return view('app');
    });
}