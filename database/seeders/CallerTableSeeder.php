<?php

namespace Database\Seeders;

use App\Models\Caller;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CallerTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        Caller::truncate();
        $faker = \Faker\Factory::create();

        for ($i=0; $i < 50; $i++)
        {
                Caller::create([
                    'lastname' => $faker->lastName(),
                    'firstname' => $faker->firstName(),
                   
                ]);
        }


    }
}