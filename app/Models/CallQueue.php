<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CallQueue extends Model
{
    use HasFactory;

    protected $fillable = [
           'caller_id', 'csr_id','queue_status', 'date_onqueue', 'date_ongoing', 'date_end', 'transaction'
    ];
}
