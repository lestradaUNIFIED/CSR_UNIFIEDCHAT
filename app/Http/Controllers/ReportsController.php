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

        $data = CallQueue::join('web3.users_info as callers', 'call_queues.caller_id', '=', 'callers.user_id')
            ->leftJoin('users', 'call_queues.csr_id', '=', 'users.id')
            ->leftJoin('categories', 'call_queues.category_id', '=', 'categories.id')
            ->leftJoin('sub_categories', 'call_queues.sub_category_id', '=', 'sub_categories.id')
            ->select(
                "call_queues.id",
                "callers.last_name as lastname",
                "callers.first_name as firstname",
                "call_queues.queue_status",
                "call_queues.date_onqueue",
                "date_ongoing",
                "date_end",
                "users.firstname as csr_firstname",
                "users.lastname as csr_lastname",
                "transaction",
                "call_queues.caller_id",
                "call_queues.created_at as date_created",
                "categories.category as category",
                "sub_categories.category as sub_category"
            )
            ->where(DB::raw("TRIM(CONCAT(IFNULL(users.firstname, ''), ' ', IFNULL(users.lastname, '')))"), 'LIKE', '%' . $request->search_str . '%')
            ->orWhere(DB::raw("TRIM(CONCAT(IFNULL(callers.first_name, ''), ' ', IFNULL(callers.last_name, '')))"), 'LIKE', '%' . $request->search_str . '%')
            ->whereBetween('call_queues.' . $request->date_criteria, [$request->from_date, $request->to_date])
            ->get();



        return $data;
    }


}