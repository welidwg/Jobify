<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            "content" => $this->faker->paragraph(),
            "post_id" => function () {
                return Post::factory()->create()->id;
            },
            "user_id" => function () {
                return User::factory()->create()->id;
            }
            //
        ];
    }
}
