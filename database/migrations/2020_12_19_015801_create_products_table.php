<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->integer('owner_id');
            $table->integer('category_id');
            $table->text('product_name');
            $table->text('description');
            $table->text('outside_status');
            $table->text('function_status');

            $table->double('price');
            $table->integer('quantity');
            $table->string('location');
            $table->string('city');
            $table->integer('sold')->default(0);  //0: selling, 1: sold

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
        Schema::dropIfExists('products');
    }
}
