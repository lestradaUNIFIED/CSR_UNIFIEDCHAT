<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\category;
use DB;
class CategoryTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $categories = ['GENERAL CONCERNS', 'TICKETING CONCERNS'];
        category::truncate();

        foreach ($categories as $value) {
            # code...
            DB::table('categories')->insert([
                'category' => $value
            ]);
        }

    }
}
