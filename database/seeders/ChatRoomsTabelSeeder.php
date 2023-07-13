<?php

namespace Database\Seeders;

use App\Models\ChatRoom;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use DB;
class ChatRoomsTabelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //

        $faker = \Faker\Factory::create();
        for ($i = 0; $i < 50; $i++) {
            DB::table('chat_rooms_copy')->insert([
                'title' => $faker->sentence,
                'body' => $faker->paragraph,
            ]);
        }

    }
}