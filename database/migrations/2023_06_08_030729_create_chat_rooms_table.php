<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chat_rooms', function (Blueprint $table) {
            $table->increments("id");
            $table->integer("current_queue_id")->nullable()->default(null);
            $table->integer("user_id")->nullable()->default(null);
            $table->integer("customer_id")->nullable()->default(null);
            $table->enum("status_code", ['1', '2', '3'])->nullable()->default(null);
            $table->enum("status_desc", ['WAITING', 'ONGOING', 'DONE'])->nullable()->default(null);
            $table->string("room_code")->default(null);
            $table->text("last_message")->nullable()->default(null);
            $table->string("chat_name")->nullable()->default(null);
            $table->timestamp("created_at")->useCurrent();
            $table->timestamp("updated_at")->nullable()->useCurrentOnUpdate();

            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('chat_rooms');
    }
};
