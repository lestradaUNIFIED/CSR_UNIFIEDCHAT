<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Throwable;

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

           

            return ChatMessage::leftJoin('users as sender_csr', 'sender_csr.id', '=',  'sender_id')
                                ->leftJoin('users as receiver_csr', 'receiver_csr.id', '=', 'receiver_id')
                                ->select("sender_csr.full_name as sender_csr", "receiver_csr.full_name as receiver_csr", "chat_messages.*")
                                ->where('chat_room_id', $room_id)->get();
        } catch (Throwable $error) {
            return $error;
        }

    }


}