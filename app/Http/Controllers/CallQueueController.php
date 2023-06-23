<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CallQueue;

use App\Models\ChatRoom;

class CallQueueController extends Controller
{
    //

    function index() {
        return CallQueue::all();
    }



    function updateQueue(Request $request, $id)
    {
        // \Log::info($request);
        $callQueue = CallQueue::findOrFail($id);
        $callQueue->update($request->all());

        $chat_room = ChatRoom::where('id', $request->room_id)->firstOrFail();
        $chat_room->user_id = $request->csr_id;
        $chat_room->chat_name = $request->chat_name;
        
        $chat_room->save();     

         return response()->json(['queue' => $callQueue, 'chat_room' => $chat_room]);
        // return CallQueue::join('chat_rooms', 'chat_rooms.id', '=', 'call_queues.caller_id')
        //     ->select('call_queues.*', 'chat_rooms.room_code', 'chat_rooms.id as roomId')
        //     ->where('call_queues.id', $id)
        //     ->get();
    }



}