<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Requirement extends Model
{
    use HasFactory;
    protected $fillable = ["label", "post_id"];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class, "post_id");
    }
}
