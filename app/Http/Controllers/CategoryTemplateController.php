<?php

namespace App\Http\Controllers;

use App\Models\CategoryTemplate;
use Illuminate\Http\Request;


class CategoryTemplateController extends Controller
{
    //

    public function allCategoryTemplate(Request $request) {
        return CategoryTemplate::all();
    }
}
