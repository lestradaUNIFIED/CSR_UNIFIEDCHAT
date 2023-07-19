<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Throwable;

class AuthController extends Controller
{
    //

    public function userInfo(Request $request, $id)
    {
        try {

            $user = User::find($id);

            return response()->json([
                'status' => true,
                'message' => 'Loaded',
                'token' => $user->remember_token,
                'type' => 'bearer',
                'user' => $user
            ], 200);

        } catch (Throwable $th) {

            return ($th);

        }
    }

    public function updateUser(Request $request, $id)
    {
        try {

            $user = User::find($id);

            return $user->update($request->all());

        } catch (Throwable $th) {

            return $th;
        }

    }

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
            $authAttempt = auth()->attempt($request->only(['userid', 'password']));
            if (!$authAttempt) {
                return response()->json([
                    'status' => false,
                    'message' => 'Invalid User Credentials'
                ], 401);
            }

            //$user = User::where('userid', $request->userid)->firstOrFail();

            $token = auth()->user()->createToken('auth_token')->plainTextToken;
            $user  = auth()->user();

            //$user = User::where('userid', $request->userid)->firstOrFail();

            // $token = $user->createToken('API TOKEN')->plainTextToken;
            //$user->remember_token = $token;
            // $user->save();

            return response()->json([
                'status' => true,
                'message' => 'User Credentials OK',
                'token' => $token,
                'type' => 'bearer',
                'user' => $user
            ], 200);
        } catch (Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function refresh()
    {
        return response()->json([
            'status' => 'success',
            'user' => Auth::user(),
            'authorisation' => [
                'token' => Auth::refresh(),
                'type' => 'bearer',
            ]
        ]);
    }
}