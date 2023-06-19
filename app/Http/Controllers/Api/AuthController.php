<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    //

    public function loginUser(Request $request)
    {
        try {
            $validateUser = Validator::make(
                $request->all(),
                [
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

            if (!Auth::attempt($request->only(['userid', 'password']))) {
                return response()->json([
                    'status' => false,
                    'message' => 'Invalid User Credentials'
                ], 401);
            }

            $user = User::where('userid', $request->userid)->firstOrFail();
            
            $token = $user->createToken('API TOKEN')->plainTextToken;
            $user->remember_token = $token;
            $user->save();

            return response()->json([
                'status' => true,
                'message' => 'User Credentials OK',
                'token' => $token,
                'user' => $user
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }
}