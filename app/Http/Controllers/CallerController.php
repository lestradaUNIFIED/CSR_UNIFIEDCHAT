<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Caller;

class CallerController extends Controller
{
    //
    public function index()
    {
        return Caller::join('call_queues',  'call_queues.caller_id', '=', 'callers.id')
            ->join('chat_rooms', 'chat_rooms.current_queue_id', '=', 'call_queues.id')
            ->leftJoin('users', 'call_queues.csr_id', '=', 'users.id')
            ->select("call_queues.id", "callers.lastname", "callers.firstname", "call_queues.queue_status", "call_queues.date_onqueue", "date_ongoing", "date_end",
                    "users.firstname as csr_firstname", "users.lastname as csr_lastname", "transaction", "call_queues.caller_id", "chat_rooms.id as room_id", "chat_rooms.room_code")
            ->where("call_queues.queue_status", "WAITING")
            ->get();
    }

    public function getCustomer(Request $request, $id) {
            return Caller::find($id);
    }

}