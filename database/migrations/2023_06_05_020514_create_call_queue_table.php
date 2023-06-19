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
        Schema::create('call_queue', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('caller_id')->default(null);
            $table->integer('csr_id')->default(null);
            $table->enum('queue_status', ['START', 'CHAT ONQUEUE', 'CHAT ONGOING', 'VIDEO CALL ONQUEUE', 'VIDEO CALL ONGOING', 'ENDED'])->default('START');
            $table->timestamp('date_onqueue')->useCurrent();
            $table->timestamp('date_ongoing')->default(null);
            $table->timestamp('date_end')->default(null);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrentOnUpdate();
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('call_queue');
    }
};
