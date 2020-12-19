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
        'buy_price',
        'buy_price_sale',
        'day_rent_price',
        'month_rent_price',
        'year_rent_price',
        'rent_price_sale',
        'amount'
    ];
}
