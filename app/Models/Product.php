<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'category_id',
        'product_name',
        'description',
        'price',
        'quantity',
        'location',
        'city',
        'sold',
        'outside_status',
        'function_status'
    ];

    protected $hidden = [
        'location',
    ];

    public function productMedias(){
        return $this->hasMany(ProductMedia::class, 'product_id');
    }
    public function questions(){
        return $this->hasMany(Question::class, 'product_id');
    }
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
