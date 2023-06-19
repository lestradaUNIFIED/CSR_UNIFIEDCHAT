<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CallQueue;

use App\Models\ChatRoom;

class CallQueueController extends Controller
{
    //

    function updateQueue(Request $request, $id)
    {

        // \Log::info($request);
        $callQueue = CallQueue::findOrFail($id);
        $callQueue->update($request->all());

        $chat_room = ChatRoom::where('customer_id', $request->customer_id)->firstOrFail();
        $chat_room->user_id = $request->csr_id;
        $chat_room->chat_name = $request->chat_name;
        
        $chat_room->save();     

        return CallQueue::join('chat_rooms', 'chat_rooms.customer_id', '=', 'call_queues.caller_id')
            ->select('call_queues.*', 'chat_rooms.room_code', 'chat_rooms.id as roomId')
            ->where('call_queues.id', $id)
            ->get();
    }



}