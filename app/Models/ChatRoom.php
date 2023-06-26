<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatRoom extends Model
{
    use HasFactory;

    protected $fillable =   [
        'customer_id',
        'chat_name',
        'room_code',
        'user_id',
        'current_queue_id',
        'last_message'
     ];

  
     public function __construct(array $attributes = []){
        parent::__construct($attributes);

        $this->room_code = uniqid();
     }

     

}