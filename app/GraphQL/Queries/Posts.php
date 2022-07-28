<?php

namespace App\GraphQL\Queries;

use App\Models\Apply;
use App\Models\Like;
use App\Models\Post;
use App\Models\User;

final class Posts
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {


        // TODO implement the resolver
        $posts = Post::where("statut", "!=", 2)->get();

        // if ($args["type"] == 2) {
        //     // $jobs = Post::Join("applies", "posts.user_id", "applies.CompanyID")->where("posts.type", 2)->where("applies.user_id", "<>", $args["user_id"])->orderBy('posts.created_at', 'desc')->get();
        //     // if (count($jobs) > 0) {
        //     //     return $jobs;
        //     // }
        //     $jobs = [];
        //     foreach ($posts as $post) {
        //         $apply = Apply::where("user_id", $args['user_id'])->where("post_id", $post->id)->first();
        //         if (!$apply) {
        //             array_push($jobs, $post);
        //         }
        //     }
        //     return $jobs;
        // }
        // $id = $args["id"];
        // $likes = Like::where("user_id", $id)->first();
        // if ($likes)
        //     $likedbyme = 1;
        // $data = ['post' => $posts, 'liked' => $likedbyme];
        return $posts;
    }
}
