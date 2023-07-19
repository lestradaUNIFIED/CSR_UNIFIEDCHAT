<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Throwable;
use DB;

class ChatMessageController extends Controller
{
    //

    function index()
    {
        return ChatMessage::all();
    }
    function saveMessage(Request $request)
    {

        try {
            return ChatMessage::create($request->all());
        } catch (Throwable $error) {
            return $error;
        }

    }

    function loadChatMessage(Request $request, $room_id)
    {




        return ChatMessage::join('call_queues', 'call_queues.id', '=', 'chat_messages.queue_id')
            ->leftJoin("users as csr", "csr.id", '=', DB::raw("IF(chat_messages.message_from='CSR', sender_id, receiver_id )"))
            ->leftJoin("web3.users_info as customer", "customer.user_id", '=', DB::raw("IF(chat_messages.message_from='CUSTOMER', sender_id, receiver_id)"))
            ->select(
                DB::raw("CONCAT(customer.first_name, ' ', customer.last_name) AS `customer`"),
                DB::raw("JSON_OBJECT('queue_status', call_queues.queue_status, 'queue_id', call_queues.id) as queue_info"),
                "csr.full_name as csr",
                "chat_messages.*"
            )
            ->where('chat_room_id', $room_id)
            ->orderBy("chat_messages.id", "ASC")
            ->get();


    }


}