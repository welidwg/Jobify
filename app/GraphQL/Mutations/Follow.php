<?php

namespace App\GraphQL\Mutations;

use App\Models\Follower;

final class Follow
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver
        $user_id = $args["user_id"];
        $followed_by = $args["followed_by"];
        $check = Follower::where("user_id", $user_id)->where("followed_by", $followed_by)->first();
        if ($check) {
            $check->delete();
            return "unfollow";
        }
        $new = new Follower;
        $new->user_id = $user_id;
        $new->followed_by = $followed_by;
        $new->save();
        return "follow";
    }
}
