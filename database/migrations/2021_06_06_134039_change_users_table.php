<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function ($table) {
            $table->dropColumn('email');
            $table->dropColumn('email_verified_at');
            $table->dropColumn('remember_token');
            $table->string('phonenumber')->unique()->nullable(false)->change();
            $table->string('address')->nullable(false)->change();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('answers', function ($table) {
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->string('phonenumber')->nullable(true)->change();
            $table->string('address')->nullable(true)->change();
        });
    }
}
