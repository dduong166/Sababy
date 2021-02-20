<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;
    protected $fillable = [
        'content'
    ];
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
    public function answers()
    {
        return $this->hasMany(Answer::class, 'question_id');
    }
    public function asker()
    {
        return $this->belongsTo(User::class, 'asker_id');
    }
}
