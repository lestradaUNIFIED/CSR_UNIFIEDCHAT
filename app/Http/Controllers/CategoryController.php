<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\category;
class CategoryController extends Controller
{
    //

    public function category(Request $request) {
        return category::all();
    }
}
