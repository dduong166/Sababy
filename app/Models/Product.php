<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'product_name',
        'description',
        'price',
        'discount',
        'amount',
        'location'
    ];

    public function productMedias(){
        return $this->hasMany(ProductMedia::class, 'product_id');
    }
    public function deals(){
        return $this->hasMany(Deal::class, 'product_id');
    }
    public function bookmarks(){
        return $this->hasMany(Bookmark::class, 'product_id');
    }
    public function questions(){
        return $this->hasMany(Question::class, 'product_id');
    }
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }


}
