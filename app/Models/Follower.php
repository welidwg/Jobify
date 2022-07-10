<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Follower extends Model
{
    use HasFactory;
    protected $fillable = ["user_id", "followed_by"];

    public function followed_by(): BelongsTo
    {
        return $this->belongsTo(User::class, "followed_by");
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, "user_id");
    }
}
