<?php

namespace App\GraphQL\Mutations;

use App\Models\Chat;

final class CreateChat
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver
        $user1 = $args["user1"];
        $user2 = $args["user2"];
        $check = Chat::where("user1", $user1)->where("user2", $user2)->orWhere(function ($q) use ($user1, $user2) {
            $q->where("user1", $user2)->where("user2", $user1);
        })->first();
        if ($check) {
            return $check;
        }
        $new = new Chat;
        $new->user1 = $user1;
        $new->user2 = $user2;
        $new->save();
        return $new;
    }
}
