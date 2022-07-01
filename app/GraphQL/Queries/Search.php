<?php

namespace App\GraphQL\Queries;

use App\Models\User;

final class Search
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $filter = $args["filter"];
        $user = User::where("name", "like", "%$filter%")->orWhere("email", "like", "%$filter%")->get();
        return $user;
    }
}
