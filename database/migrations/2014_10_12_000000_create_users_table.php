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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('firstname');
            $table->string('lastname');
            $table->string('full_name');
            $table->string('nick_name');
            $table->string('userid')->unique();
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('user_role', ['1210', '5150'])->nullable()->default(null);
            $table->string('category')->nullable()->default("[1]");
            $table->integer('created_by_userid')->default(0);
            $table->integer('updated_by_userid')->default(0);
            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
};
