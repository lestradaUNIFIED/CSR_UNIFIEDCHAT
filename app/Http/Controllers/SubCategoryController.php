<?php

namespace App\Http\Controllers;

use App\Models\category;
use Illuminate\Http\Request;
use App\Models\SubCategory;
use DB;
class SubCategoryController extends Controller
{
    //
    public function allCategories(Request $request) {
        return category::leftJoin('sub_categories', 'sub_categories.category_id', '=', 'categories.id')
        ->select(DB::raw('categories.id as category_id'), DB::raw('sub_categories.id as sub_category_id'),
        DB::raw('categories.category as category'), DB::raw('sub_categories.category as sub_category'))
        ->get();
    }
}
