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
            $table->bigIncrements('product_id');
            $table->integer('owner_id');
            $table->string('product_name');
            $table->text('description')->nullable();

            $table->double('buy_price')->nullable();
            $table->double('buy_price_sale')->default(0);

            $table->double('day_rent_price')->nullable();
            $table->double('month_rent_price')->nullable();
            $table->double('year_rent_price')->nullable();
            $table->double('rent_price_sale')->default(0);

            $table->integer('amount');
            $table->integer('category_id');
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
