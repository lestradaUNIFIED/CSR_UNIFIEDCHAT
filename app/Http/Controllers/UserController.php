<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Throwable;
use Validator;
use \App\Models\User;

class UserController extends Controller
{
    //

    public function user(Request $request)
    {
        return User::whereNotNull('id')->orderBy('id', 'desc')->get();
    }

    function createUser(Request $request)
    {

        $validateUser = Validator::make(
            $request->all(),
            [
                'lastname' => 'required',
                'firstname' => 'required',
                'email' => ['email', 'required'],
                'userid' => 'required',
                'password' => 'required'
            ]
        );
        if ($validateUser->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'validation error',
                'errors' => $validateUser->errors()
            ], 401);
        }
        $searchEmail = User::where('email', $request->email)->get();
        if ($searchEmail->count() > 0) {
            return response()->json(['status' => false, 'message_type' => 'error', 'message' => 'Email Already Exists!']);
        }

        User::create($request->all());
        return response()->json(['status' => 201, "statusText" => "Created"]);


    }
}