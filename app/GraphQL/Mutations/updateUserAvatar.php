<?php

namespace App\GraphQL\Mutations;

final class updateUserAvatar
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver
        return $args["image"];
    }
}