<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Apply extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'post_id', 'CompanyID'];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class, "post_id");
    }

    public function applicants(): BelongsTo
    {
        return $this->BelongsTo(User::class, "user_id");
    }
}
