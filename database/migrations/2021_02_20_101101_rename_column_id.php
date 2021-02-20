<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameColumnId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->renameColumn('question_id', 'id');
        });
        Schema::table('product_medias', function (Blueprint $table) {
            $table->renameColumn('product_media_id', 'id');
        });
        Schema::table('products', function (Blueprint $table) {
            $table->renameColumn('product_id', 'id');
        });
        Schema::table('deals', function (Blueprint $table) {
            $table->renameColumn('deal_id', 'id');
        });
        Schema::table('categories', function (Blueprint $table) {
            $table->renameColumn('category_id', 'id');
        });
        Schema::table('carts', function (Blueprint $table) {
            $table->renameColumn('cart_product_id', 'id');
        });
        Schema::table('bookmarks', function (Blueprint $table) {
            $table->renameColumn('bookmark_id', 'id');
        });
        Schema::table('answers', function (Blueprint $table) {
            $table->renameColumn('answer_id', 'id');
        });
        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->renameColumn('id', 'question_id');
        });
        Schema::table('product_medias', function (Blueprint $table) {
            $table->renameColumn('id', 'product_media_id');
        });
        Schema::table('products', function (Blueprint $table) {
            $table->renameColumn('id', 'product_id');
        });
        Schema::table('deals', function (Blueprint $table) {
            $table->renameColumn('id', 'deal_id');
        });
        Schema::table('categories', function (Blueprint $table) {
            $table->renameColumn('id', 'category_id');
        });
        Schema::table('carts', function (Blueprint $table) {
            $table->renameColumn('id', 'cart_product_id');
        });
        Schema::table('bookmarks', function (Blueprint $table) {
            $table->renameColumn('id', 'bookmark_id');
        });
        Schema::table('answers', function (Blueprint $table) {
            $table->renameColumn('id', 'answer_id');
        });
    }
}
