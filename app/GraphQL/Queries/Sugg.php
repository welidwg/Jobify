<?php

namespace App\GraphQL\Queries;

use App\Models\User;

final class Sugg
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $id = $args["id"];
        $type = $args["type"];
        // $authed=User::where("id",$id)->with("skills")->first();
        // $skills
        // if(count($authed->skills)){

        // }
        $user = User::inRandomOrder()->where("id", "!=", $id)->where("type", "!=", $type)->limit(2)->get();
        return $user;
    }
}
