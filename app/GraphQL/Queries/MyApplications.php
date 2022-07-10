<?php

namespace App\GraphQL\Queries;

use App\Models\Apply;

final class MyApplications
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver
        $user_id = $args["user_id"];
        $applies = Apply::where("user_id", $user_id)->get();
        return $applies;
    }
}
