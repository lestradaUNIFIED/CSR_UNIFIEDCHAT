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
        Schema::create('call_queues', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('caller_id')->default(null);
            $table->integer('category_id')->nullable()->default(null);
            $table->integer('sub_category_id')->nullable()->default(null);
            $table->integer('csr_id')->nullable()->default(null);
            $table->enum('queue_status', ['WAITING', 'ONGOING', 'RESOLVED', 'PENDING', 'CANCELLED'])->default('WAITING');
            $table->timestamp('date_onqueue')->useCurrent();
            $table->timestamp('date_ongoing')->nullable()->default(null);
            $table->timestamp('date_end')->nullable()->default(null);
            $table->string('duration')->default('00:00:00');
            $table->string('remarks')->nullable()->default(null);
            $table->string('transaction')->nullable()->default(null);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('call_queues');
    }
};
