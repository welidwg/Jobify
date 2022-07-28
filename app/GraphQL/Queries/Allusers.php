<?php

namespace App\GraphQL\Queries;

use App\Models\User;
use GraphQL\Error\Error;
use Nette\Utils\Paginator;

final class Allusers
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver
        try {

            $id = $args["id"];
            $users = User::where("id", "!=", $id)->paginate(2);
            return $users;
        } catch (\Throwable $th) {
            return new Error($th->getMessage());
        }
    }
}
