<?php

namespace App\Http\Controllers;

use Auth;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    //

    public function authenticate(Request $request)
    {


        // echo "<script>console.log('{$request}' );</script>";
        $credentials = $request->getCredentials();
        // $credentials = $request->validate([
        //     'username' => ['required'],
        //     'password' => ['required']
        // ]);

        if (!Auth::validate($credentials)) {
            redirect()->to('/')->withErrors(trans('auth.failed'));

            $request->session()->regenerate();
            $user = Auth::user();
            return response()->json($user);
        }

        $user = Auth::getProvider()->retrieveByCredentials($credentials);

        Auth::login($user);


        return response()->json(['errors' => ['username' => 'Invalid login credentials',]], 422);
    }
}