<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Throwable;
use DB;

class ChatMessageController extends Controller
{
    //

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

        try {



            return ChatMessage::leftJoin('users as sender_csr', 'sender_csr.id', '=', 'sender_id')
                ->leftJoin('users as receiver_csr', 'receiver_csr.id', '=', 'receiver_id')
                ->leftJoin('callers as caller_sender', 'caller_sender.id', '=', 'sender_id')
                ->leftJoin('callers as caller_receiver', 'caller_receiver.id', '=', 'receiver_id')
                ->select("sender_csr.full_name as sender_csr", "receiver_csr.full_name as receiver_csr", "caller_receiver.firstname as creceiver", "caller_sender.firstname as csender",
                DB::raw("IFNULL(sender_csr.full_name, caller_sender.firstname) as sender"), "chat_messages.*" )
                ->where('chat_room_id', $room_id)->get();
        } catch (Throwable $error) {
            return $error;
        }

    }


}