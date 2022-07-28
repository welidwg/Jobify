<?php

namespace App\GraphQL\Queries;

use App\Models\Notification;
use App\Models\User;

final class Mynotif
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver
        $user_id = $args["user_id"];
        $user = User::where("id", $user_id)->first();
        $notifs = Notification::where("user_id", $user_id)->orWhere("to", "like", $user->type)->get();
        return $notifs;
    }
}
