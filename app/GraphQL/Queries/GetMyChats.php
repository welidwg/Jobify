<?php

namespace App\GraphQL\Queries;

use App\Models\Chat;
use GraphQL\Error\Error;

final class GetMyChats
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver

        try {
            $user_id = $args["user_id"];
            $chats = Chat::where("user1", $user_id)->orWhere("user2", $user_id)->get();
            return $chats;
        } catch (\Throwable $th) {
            return new Error($th->getMessage());
        }
    }
}
