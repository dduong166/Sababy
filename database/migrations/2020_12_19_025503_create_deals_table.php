<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDealsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('deals', function (Blueprint $table) {
            $table->bigIncrements('deal_id');
            $table->integer('user_id');
            $table->integer('product_id');
            $table->integer('rent_type');  //0: day, 1: month, 2:year
            $table->integer('amount_of_time');  //number of days,months,years of renting
            $table->double('total_paid');
            $table->string('comment_content');
            $table->integer('rate');
            $table->integer('rent_status');  //0: returned, 1:renting
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('deals');
    }
}
