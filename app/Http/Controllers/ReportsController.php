<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\CallQueue;
use DB;

class ReportsController extends Controller
{
    //
    public function queue(Request $request)
    {

        $data = CallQueue::join('callers', 'call_queues.caller_id', '=', 'callers.id')
            ->leftJoin('users', 'call_queues.csr_id', '=', 'users.id')
            ->select(
                "call_queues.id",
                "callers.lastname",
                "callers.firstname",
                "call_queues.queue_status",
                "call_queues.date_onqueue",
                "date_ongoing",
                "date_end",
                "users.firstname as csr_firstname",
                "users.lastname as csr_lastname",
                "transaction",
                "call_queues.caller_id",
                "call_queues.created_at as date_created"
            )
            ->where(DB::raw("TRIM(CONCAT(IFNULL(users.firstname, ''), ' ', IFNULL(users.lastname, '')))"), 'LIKE', '%' . $request->search_str . '%')
            ->orWhere(DB::raw("TRIM(CONCAT(IFNULL(callers.firstname, ''), ' ', IFNULL(callers.lastname, '')))"), 'LIKE', '%' . $request->search_str . '%')
            ->whereBetween('call_queues.'.$request->date_criteria, [$request->from_date, $request->to_date])
            ->get();



        return $data;
    }


}