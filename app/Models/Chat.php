<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Chat extends Model
{
    use HasFactory;

    protected $fillable = ["user1", "user2"];


    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, "chat_id");
    }
    public function owner1(): BelongsTo
    {
        return $this->belongsTo(User::class, "user1");
    }
    public function owner2(): BelongsTo
    {
        return $this->belongsTo(User::class, "user2");
    }
}
