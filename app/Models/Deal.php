<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deal extends Model
{
    use HasFactory;

    protected $filltable = [
        'rent_type', 'comment_content', 'rate'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
