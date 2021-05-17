<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    protected $fillable = [
        'category_name', 'parent_category_id'
    ];

    public function products(){
        return $this->hasMany(Product::class, 'category_id');
    }

    public function sub_categories() {
        return $this->hasMany(Category::class, 'parent_category_id'); //get all subs. NOT RECURSIVE
    }

}
