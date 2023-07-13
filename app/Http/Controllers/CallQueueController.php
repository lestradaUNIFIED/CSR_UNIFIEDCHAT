<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CallQueue;

use App\Models\ChatRoom;

class CallQueueController extends Controller
{
    //

    function index()
    {
        return CallQueue::all();
    }


    function queueList(Request $request){

      
            return CallQueue::join('web3.users_info as customer', 'call_queues.caller_id', '=', 'customer.user_id')
            ->join('chat_rooms', 'chat_rooms.current_queue_id', '=', 'call_queues.id')
            ->leftJoin('users', 'call_queues.csr_id', '=', 'users.id')
            ->select(
                    "call_queues.id",
                    "customer.last_name as lastname",
                    "customer.first_name as firstname",
                    "call_queues.queue_status",
                    "call_queues.date_onqueue",
                    "date_ongoing",
                    "date_end",
                    "users.firstname as csr_firstname",
                    "users.lastname as csr_lastname",
                    "transaction",
                    "call_queues.caller_id",
                    "chat_rooms.id as room_id",
                    "chat_rooms.room_code"
            )
            ->where("call_queues.queue_status", "WAITING")
            ->get();
        }

        function videoCallQueueList(Request $request, $csr_id){
            return CallQueue::join('web3.users_info as customer', 'call_queues.caller_id', '=', 'customer.user_id')
            ->join('chat_rooms', 'chat_rooms.customer_id', '=', 'call_queues.caller_id')
            ->leftJoin('users', 'call_queues.csr_id', '=', 'users.id')
            ->select(
                    "call_queues.id",
                    "customer.last_name as lastname",
                    "customer.first_name as firstname",
                    "call_queues.queue_status",
                    "call_queues.created_at as date_onqueue",
                    "date_ongoing",
                    "date_end",
                    "users.firstname as csr_firstname",
                    "users.lastname as csr_lastname",
                    "transaction",
                    "call_queues.caller_id",
                    "chat_rooms.id as room_id",
                    "chat_rooms.room_code",
                    "call_queues.duration"
            )
            ->where("call_queues.transaction", "VIDEO CALL")
            ->where("call_queues.csr_id", $csr_id)
            ->orderBy('call_queues.id', 'DESC')
            ->get();
        }
 

    function updateQueue(Request $request, $id)
    {
        // \Log::info($request);
        $callQueue = CallQueue::findOrFail($id);
        $callQueue->update($request->all());

        $chat_room = ChatRoom::where('id', $request->room_id)->firstOrFail();
        $chat_room->user_id = $request->csr_id;
        $chat_room->chat_name = $request->chat_name;
        $chat_room->status_code = '2';
        $chat_room->status_desc = 'ONGOING';

        $chat_room->save();

        return response()->json(['queue' => $callQueue, 'chat_room' => $chat_room]);
        // return CallQueue::join('chat_rooms', 'chat_rooms.id', '=', 'call_queues.caller_id')
        //     ->select('call_queues.*', 'chat_rooms.room_code', 'chat_rooms.id as roomId')
        //     ->where('call_queues.id', $id)
        //     ->get();
    }

    function closeQueue(Request $request, $id)
    {
        $chatRoom = ChatRoom::where('id', $request->room_id)->firstOrFail();
        $chatRoom->status_desc = 'DONE';
        $chatRoom->status_code = '3';
        $chatRoom->save();

        $callQueue = CallQueue::findOrFail($id);
        $callQueue->update($request->all());
        return response()->json(["status_code" => $chatRoom->status_code]);

    }




}