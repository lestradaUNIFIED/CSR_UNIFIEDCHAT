<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


use App\Models\User;
class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

             //
            User::truncate();
            $faker = \Faker\Factory::create();
    
            for ($i=0; $i < 10; $i++)
            {
                $lastname = $faker->lastName();
                $firstname = $faker->firstName();
                
                    User::create([
                        'lastname' => $lastname,
                        'firstname' => $firstname,
                        'full_name' => $firstname.' '.$lastname,
                        'email' => strtolower(mb_substr($firstname, 0, 1).'.'.$lastname).'@'.$faker->freeEmailDomain(),
                        'password' => strtolower($lastname),
                        'userid' => strtolower(mb_substr($firstname, 0, 1).'.'.$lastname)
                     ]);
            }
    
       
        //
    }
}
