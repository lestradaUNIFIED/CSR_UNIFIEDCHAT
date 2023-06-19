<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\CallerController;
use App\Http\Controllers\CallQueueController;
use App\Http\Controllers\ChatMessageController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ChatRoomController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Caller;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::apiResource('posts', PostController::class)->middleware('auth:sanctum');
Route::post('/login', [AuthController::class, 'loginUser']);
Route::get('/callqueues', [CallerController::class, 'index']);
Route::put('/update-queue/{id}', [CallQueueController::class, 'updateQueue']);
Route::post('/chat-room', [ChatRoomController::class, 'createChatRoom']);
Route::get('/chat-room/{customer_id}/{room_code}', [ChatRoomController::class, 'joinRoom']);
Route::get('/chat-rooms/{csr_id}', [ChatRoomController::class, 'chatRoomByCSR']);
Route::get('/chat-message/messages/{room_id}', [ChatMessageController::class, 'loadChatMessage']);
Route::get('/caller/info/{id}', [CallerController::class, 'getCustomer']);
Route::post('/chat-message/message', [ChatMessageController::class, 'saveMessage']);


Route::get('test', function() {
    event(new App\Events\Test());
    return "Event sent!";
});



