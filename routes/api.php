<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\CallerController;
use App\Http\Controllers\CallQueueController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CategoryTemplateController;
use App\Http\Controllers\ChatMessageController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ChatRoomController;

use App\Http\Controllers\ReportsController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\UserController;

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
// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });


//Route::apiResource('posts', PostController::class)->middleware('auth:sanctum');
Route::post('/login', [AuthController::class, 'loginUser']);
Route::get('/user/{id}', [AuthController::class, 'userInfo']);
Route::post('/user', [UserController::class, 'createUser']);
Route::middleware('auth:sanctum')->get('/user', [UserController::class, 'user']);
Route::put('/user/{id}', [AuthController::class, 'updateUser']);

//Route::middleware('auth:sanctum')->get('/user', [UserController::class, 'user'] );
Route::get('/callqueues', [CallQueueController::class, 'queueList']);

Route::put('/update-queue/{id}', [CallQueueController::class, 'updateQueue']);
Route::put('/queue/action/4/{id}', [CallQueueController::class, 'closeQueue']);


Route::post('/chat-room', [ChatRoomController::class, 'createChatRoom']);
Route::get('/chat-room/{id}', [ChatRoomController::class, 'chatRoom']);

Route::post('/chat-room/action/1', [ChatRoomController::class, 'validateChatRoom']);
Route::get('/chat-room/{customer_id}/{room_code}', [ChatRoomController::class, 'joinRoom']);
Route::get('/chat-rooms/{csr_id}', [ChatRoomController::class, 'chatRoomByCSR']);
Route::get('/chat-rooms', [ChatRoomController::class, 'index']);

Route::get('/chat-message/messages/{room_id}', [ChatMessageController::class, 'loadChatMessage']);
Route::post('/chat-message/message', [ChatMessageController::class, 'saveMessage']);

Route::get('/caller/info/{id}', [CallerController::class, 'getCustomer']);

Route::get('/video-call/{csr_id}', [CallQueueController::class, 'videoCallQueueList']);

Route::middleware('auth:sanctum')->post('/reports/queue', [ReportsController::class, 'queue']);

Route::get('/category', [CategoryController::class, 'category']);
Route::get('/all-category', [SubCategoryController::class, 'allCategories']);
Route::get('/category-template', [CategoryTemplateController::class, 'allCategoryTemplate']);

Route::get('test', function () {
    event(new App\Events\Test());
    return "Event sent!";
});