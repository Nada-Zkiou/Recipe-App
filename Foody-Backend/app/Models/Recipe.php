<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'title',
        'ingredients',
        'steps',
        'tags',
        'image_path',
    ];

    protected $casts = [
        'tags' => 'array',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function favoritedBy()
{
    return $this->belongsToMany(User::class, 'favorites');
}

public function ratings()
{
    return $this->hasMany(Rating::class);
}

public function averageRating()
{
    return $this->ratings()->avg('rating');
}

}
