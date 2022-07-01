<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use App\Models\Like;
use App\Models\Post;

final class AddLike
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver
        $user_id = $args["user_id"];
        $post_id = $args["post_id"];
        $user = User::where("id", $user_id)->first();
        $post = Post::where("id", $post_id)->first();
        $Likes = Like::where("post_id", $post_id)->where("user_id", $user_id)->first();
        if ($Likes) {
            $post->decrement("likes");
            $Likes->delete();
            $message = "Unlike";
        } else {
            $post->increment("likes");
            $Likes = new Like;
            $Likes->user_id = $user_id;
            $Likes->post_id = $post_id;
            $message = "Like";
            $Likes->save();
        }
        $post->save();


        return $message;
    }
}
