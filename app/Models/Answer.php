<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    use HasFactory;
    protected $fillable = [
        'content'
    ];
    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id');
    }
    public function answerer()
    {
        return $this->belongsTo(User::class, 'answerer_id');
    }
}
