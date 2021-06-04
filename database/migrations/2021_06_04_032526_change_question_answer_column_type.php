<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeQuestionAnswerColumnType extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('answers', function ($table) {
            $table->text('content')->change();
        });
        Schema::table('questions', function ($table) {
            $table->text('content')->change();
        });
        Schema::table('categories', function ($table) {
            $table->text('category_image_url')->change();
        });
        Schema::table('products', function ($table) {
            $table->text('product_name')->change();
        });
        Schema::table('product_medias', function ($table) {
            $table->text('media_url')->change();
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
            $table->string('content')->change();
        });
        Schema::table('questions', function ($table) {
            $table->string('content')->change();
        });
        Schema::table('categories', function ($table) {
            $table->string('category_image_url')->change();
        });
        Schema::table('products', function ($table) {
            $table->string('product_name')->change();
        });
        Schema::table('product_medias', function ($table) {
            $table->string('media_url')->change();
        });
    }
}
