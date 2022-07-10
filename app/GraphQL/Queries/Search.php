<?php

namespace App\GraphQL\Queries;

use App\Models\Follower;
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
        $type = $args["type"];
        $id = $args["id"];
        $arr = [];
        if ($type == "mycontact") {
            $following = Follower::where("followed_by", $id)->select("user_id")->get();
            foreach ($following as $foll) {
                array_push($arr, $foll->user_id);
            }
            $user = User::whereIn("id", $arr)->where("name", "like", "%$filter%")->get();
        } else {
            $user = User::where("name", "like", "%$filter%")->get();
        }
        return $user;
    }
}
