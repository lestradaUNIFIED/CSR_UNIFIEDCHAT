<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CallQueue;

class CallQueueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        CallQueue::truncate();
        $faker = \Faker\Factory::create();

        for ($i=0; $i < 50; $i++)
        {
                CallQueue::create([
                    'caller_id' => $i + 1                   
                ]);
        }

    }
}
