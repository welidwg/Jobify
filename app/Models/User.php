<?php

namespace App\Models;

use App\GraphQL\Mutations\Follow;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'birthDate',
        'about'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
        # code...
    }

    public function comments(): HasMany
    {
        # code...

        return $this->hasMany(Comment::class);
    }



    public function applications(): HasMany
    {
        # code...
        return $this->HasMany(Apply::class, "user_id");
    }

    public function applicationsReceived(): HasMany
    {
        # code...
        return $this->hasMany(Apply::class, "CompanyID");
    }

    public function experiences(): HasMany
    {
        return $this->hasMany(Experience::class, "user_id");
    }

    public function educations(): HasMany
    {
        return $this->hasMany(Education::class, "user_id");
    }

    public function followers(): HasMany
    {
        return $this->hasMany(Follower::class, "user_id");
    }

    public function following(): HasMany
    {
        return $this->hasMany(Follower::class, "followed_by");
    }
}
