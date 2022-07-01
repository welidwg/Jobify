<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    use HasFactory;
    protected $appends = ['likedByMe'];

    protected $fillable = [
        'title',
        'content',
        'user_id',
    ];
    public function likedByMe()
    {
    }
    public function getLikedByMeAttribute()
    {
        return $this->likedByMe();
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function comments(): HasMany
    {
        # code...
        return $this->hasMany(Comment::class);
    }


    public function skills(): HasMany
    {
        return $this->hasMany(SkillPost::class);
    }

    public function requirements(): HasMany
    {
        return $this->hasMany(Requirement::class);
    }




    public function applications(): HasMany
    {
        return $this->hasMany(Apply::class);
    }
}
